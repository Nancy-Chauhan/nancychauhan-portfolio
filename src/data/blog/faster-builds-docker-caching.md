---
title: "Faster Builds with Docker Layer Caching"
description: "Optimize your Docker builds by understanding the layer caching system, writing cache-friendly Dockerfiles, using multi-stage builds, and configuring CI pipelines for maximum cache reuse."
pubDate: 2020-11-10
tags: ["docker", "ci-cd", "devops"]
externalUrl: "https://nancy-chauhan.medium.com/"
---

Slow Docker builds are one of the most common developer experience complaints. A build that takes five minutes locally and ten minutes in CI adds up to hours of wasted time across a team every week. The good news is that Docker has a built-in caching mechanism that, when used correctly, can dramatically reduce build times. The bad news is that many Dockerfiles are written in ways that defeat this caching entirely.

In this post, I will explain how Docker's layer caching works, show you how to write Dockerfiles that maximize cache hits, and share strategies for preserving cache in CI/CD environments.

## How Docker Layers Work

A Docker image is composed of a stack of read-only layers. Each instruction in a Dockerfile (FROM, RUN, COPY, ADD) creates a new layer. When you build an image, Docker checks each instruction against its cache:

1. **Cache hit:** If Docker finds an existing layer that matches the instruction and its context, it reuses that layer. The build skips execution of that step.
2. **Cache miss:** If the instruction or its context has changed, Docker executes the instruction and creates a new layer. All subsequent layers are also rebuilt, even if their instructions have not changed.

This "cache invalidation cascades" behavior is the most important thing to understand about Docker caching. Once a layer is invalidated, everything after it rebuilds.

Consider this Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
```

Every time you change any file in your source code, the `COPY . .` instruction invalidates the cache because the context (the set of files being copied) has changed. This means `npm install` runs again, even if your dependencies have not changed. For a project with hundreds of dependencies, this can add minutes to every build.

## Writing Cache-Friendly Dockerfiles

The fix is to order your Dockerfile instructions from least frequently changing to most frequently changing:

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy only dependency files first
COPY package.json package-lock.json ./
RUN npm ci

# Then copy source code
COPY . .
RUN npm run build
```

Now, when you change source code, the `COPY package.json package-lock.json` layer is still cached (those files did not change), and `npm ci` is skipped. Only the `COPY . .` and `npm run build` steps execute.

The same principle applies to other languages:

**Python:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["python", "app.py"]
```

**Go:**
```dockerfile
FROM golang:1.21-alpine
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o /bin/server ./cmd/server
```

**Java (Gradle):**
```dockerfile
FROM gradle:8-jdk17 AS build
WORKDIR /app

COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon

COPY src ./src
RUN gradle build --no-daemon
```

## Multi-Stage Builds

Multi-stage builds reduce final image size and can improve caching. The idea is to use one stage for building and another for the final runtime image:

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /bin/server ./cmd/server

# Runtime stage
FROM alpine:3.18
RUN apk add --no-cache ca-certificates
COPY --from=builder /bin/server /bin/server
EXPOSE 8080
CMD ["/bin/server"]
```

The final image contains only the compiled binary and minimal runtime dependencies, not the entire Go toolchain. This reduces the image from hundreds of megabytes to tens of megabytes.

For Node.js applications, multi-stage builds are especially valuable:

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

The final image only contains production dependencies and the built output, not devDependencies or source code.

## Cache Busting: Intentional and Accidental

Sometimes you need to intentionally bust the cache — for example, to pull the latest version of a package. You can use a build argument:

```dockerfile
ARG CACHE_BUST=1
RUN apt-get update && apt-get install -y some-package
```

Change the value of `CACHE_BUST` to force a rebuild of everything after that line:
```bash
docker build --build-arg CACHE_BUST=$(date +%s) .
```

More commonly, you want to avoid accidental cache busting. Common pitfalls:

- **Copying unnecessary files:** Use a `.dockerignore` file to exclude files that should not be in the build context:
  ```
  # .dockerignore
  node_modules
  .git
  .env
  *.md
  .DS_Store
  dist
  coverage
  ```

- **Timestamps in COPY:** Docker checks file modification times as part of cache validation. If your build system touches files (even without changing content), the cache is invalidated. This is common in CI where a fresh checkout sets all timestamps to the current time.

- **Non-deterministic commands:** A `RUN` instruction is cached based on the command string, not the output. `RUN apt-get update` always uses the cache if the string has not changed, even if the package index has changed upstream. Combine update and install in one layer:
  ```dockerfile
  RUN apt-get update && apt-get install -y \
      package1 \
      package2 \
      && rm -rf /var/lib/apt/lists/*
  ```

## Docker BuildKit

Docker BuildKit (enabled by default in Docker Desktop and Docker 23.0+) brings significant improvements to caching:

**Parallel stage building:** BuildKit can build independent stages in parallel, reducing total build time for multi-stage Dockerfiles.

**Cache mounts:** BuildKit lets you mount a cache directory that persists across builds. This is incredibly useful for package manager caches:

```dockerfile
# syntax=docker/dockerfile:1
FROM golang:1.21-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o /bin/server ./cmd/server
```

The Go module cache and build cache are preserved across builds, even if the layer itself is invalidated.

For npm:
```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
```

For pip:
```dockerfile
RUN --mount=type=cache,target=/root/.cache/pip pip install -r requirements.txt
```

## CI/CD Cache Strategies

The biggest challenge with Docker caching is in CI/CD, where each build typically starts with a clean environment and no cached layers. There are several strategies to address this:

### Registry-Based Caching

Push cached layers to your container registry and pull them in subsequent builds:

```yaml
# GitHub Actions example
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: myapp:latest
    cache-from: type=registry,ref=myapp:cache
    cache-to: type=registry,ref=myapp:cache,mode=max
```

### GitHub Actions Cache

Use the GitHub Actions cache backend for BuildKit:

```yaml
- name: Build
  uses: docker/build-push-action@v5
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

This stores cache layers in the GitHub Actions cache, which is faster than pulling from a registry.

### Local Cache in Self-Hosted Runners

If you use self-hosted CI runners, the local Docker cache persists between builds. This gives you the same caching behavior as local development. Just be mindful of disk space — prune old images periodically with `docker system prune`.

## Measuring Build Performance

You cannot improve what you do not measure. Use `docker build` with the `--progress=plain` flag to see timing for each step:

```bash
DOCKER_BUILDKIT=1 docker build --progress=plain .
```

Look for steps that take a long time and ask: is this step being cached? If not, can I reorder my Dockerfile to cache it? BuildKit also provides build duration metrics that you can collect and track over time.

Optimizing Docker builds is one of those high-leverage investments that benefits your entire team. A few hours spent restructuring Dockerfiles can save hundreds of hours of collective build time.
