---
title: "Understanding Load Balancing: Concepts and Algorithms"
description: "A deep dive into load balancing algorithms including round-robin, least connections, IP hash, and weighted strategies, with guidance on when to use each approach."
pubDate: 2021-03-15
tags: ["distributed-systems", "infrastructure"]
image: "/blog/load-balancing.webp"
externalUrl: "https://levelup.gitconnected.com/loadbalancing-a0e805baea37"
---

Load balancing is one of those foundational concepts in distributed systems that every engineer encounters sooner or later. Whether you are running a handful of microservices or operating infrastructure at scale, understanding how traffic gets distributed across your servers is essential. In this post, I want to walk through the core load balancing algorithms, explain the trade-offs of each, and share some practical advice on choosing the right one for your workload.

## Why Load Balancing Matters

At its simplest, a load balancer sits between clients and a pool of backend servers and decides which server should handle each incoming request. The goals are straightforward: distribute work evenly so no single server becomes a bottleneck, improve response times for users, and provide fault tolerance by routing around unhealthy instances.

Without a load balancer, you are limited to vertical scaling — buying a bigger machine. With one, you unlock horizontal scaling — adding more machines. This distinction is at the heart of building systems that can grow with demand.

## Layer 4 vs Layer 7 Load Balancing

Before diving into algorithms, it helps to understand the two broad categories of load balancers:

**Layer 4 (Transport layer)** load balancers operate at the TCP/UDP level. They make routing decisions based on IP addresses and port numbers without inspecting the actual content of the request. This makes them extremely fast and efficient, but they lack visibility into application-level details. HAProxy in TCP mode and AWS Network Load Balancer are examples.

**Layer 7 (Application layer)** load balancers inspect HTTP headers, cookies, URL paths, and other application-level data. This allows for much more sophisticated routing — for example, sending all API requests to one pool of servers and static assets to another. Nginx, Envoy, and AWS Application Load Balancer fall into this category.

The choice between L4 and L7 depends on whether you need content-aware routing. For most web applications, L7 is the better choice because it gives you flexibility for path-based routing, header-based routing, and SSL termination at the load balancer.

## Round-Robin

Round-robin is the simplest load balancing algorithm. Requests are distributed to backend servers in sequential order: the first request goes to server 1, the second to server 2, the third to server 3, and then back to server 1.

```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A
...
```

**When to use it:** Round-robin works well when your backend servers are homogeneous (same hardware, same capacity) and requests are roughly uniform in cost. It is a reasonable default for stateless services where any server can handle any request equally well.

**Limitations:** Round-robin does not account for the actual load on each server. If one request triggers an expensive database query while another serves a cached response, the server handling the expensive query could become overloaded while others sit idle. It also does not consider differences in server capacity.

## Weighted Round-Robin

Weighted round-robin extends the basic algorithm by assigning a weight to each server. A server with weight 3 receives three times as many requests as a server with weight 1.

```
Servers: A (weight=3), B (weight=1), C (weight=1)
Sequence: A, A, A, B, C, A, A, A, B, C, ...
```

**When to use it:** This is useful during rolling deployments where you might have a mix of old and new hardware, or when you want to gradually shift traffic to a new version of a service (canary deployments). You can also use it to direct more traffic to more powerful machines in a heterogeneous cluster.

**Limitations:** Like basic round-robin, it does not account for real-time server load. The weights are static and require manual configuration or an external system to adjust them.

## Least Connections

The least connections algorithm routes each new request to the server with the fewest active connections. This is a dynamic algorithm — it considers the current state of each server rather than following a fixed pattern.

```
Server A: 5 active connections
Server B: 2 active connections
Server C: 8 active connections
→ Next request goes to Server B
```

**When to use it:** Least connections shines when requests have highly variable processing times. If some requests take milliseconds and others take seconds, round-robin would eventually overload servers that happen to receive many slow requests. Least connections naturally adapts because slow servers accumulate connections and stop receiving new ones.

This algorithm is particularly good for WebSocket connections, long-polling, and any protocol where connections are long-lived.

**Limitations:** It requires the load balancer to track connection state for every backend, which adds some overhead. It can also be less effective if connections are very short-lived, because by the time the load balancer routes a request, the connection count may have already changed.

## Weighted Least Connections

This combines the least connections approach with server weights. The algorithm considers both the number of active connections and the server's capacity weight. The routing decision is based on the ratio of active connections to weight — the server with the lowest ratio gets the next request.

```
Server A: 10 connections, weight=5 → ratio = 2.0
Server B: 4 connections, weight=2  → ratio = 2.0
Server C: 3 connections, weight=2  → ratio = 1.5
→ Next request goes to Server C
```

**When to use it:** This is ideal for heterogeneous environments where servers have different capacities and request durations are variable. It gives you the adaptive behavior of least connections while respecting the capacity differences between servers.

## IP Hash

IP hash uses the client's IP address to determine which server receives the request. A hash function maps each IP address to a specific server, ensuring that the same client always reaches the same backend.

```
hash(client_ip) % number_of_servers = server_index
```

**When to use it:** IP hash provides a form of session affinity (sticky sessions) without requiring cookies or other application-level mechanisms. It is useful when your application stores session state on the server and you need a given client to consistently reach the same backend.

**Limitations:** IP hash has significant drawbacks. If a server goes down, all clients mapped to that server need to be remapped, which disrupts their sessions. The distribution can also be uneven if many clients share the same IP (for example, users behind a corporate NAT). Consistent hashing is a better alternative for most use cases because it minimizes remapping when servers are added or removed.

## Consistent Hashing

Consistent hashing arranges servers on a virtual ring. Each request is hashed and mapped to the nearest server on the ring in a clockwise direction. When a server is added or removed, only a fraction of requests need to be remapped — specifically, only those that were mapped to the affected portion of the ring.

**When to use it:** Consistent hashing is excellent for caching layers and distributed data stores where you want to minimize cache invalidation when the server pool changes. It is used extensively in systems like Memcached, Cassandra, and CDN routing.

## Health Checks and Failover

No matter which algorithm you choose, health checks are essential. A load balancer must be able to detect when a backend server is unhealthy and stop sending it traffic. There are two common approaches:

- **Active health checks:** The load balancer periodically sends probes (HTTP requests, TCP connections) to each backend and marks them as healthy or unhealthy based on the response.
- **Passive health checks:** The load balancer monitors actual traffic and marks a server as unhealthy if it sees too many errors or timeouts.

Most production load balancers use a combination of both. Active checks catch servers that are completely down, while passive checks catch servers that are responding but degraded.

## Practical Recommendations

After working with various load balancing setups, here are my recommendations:

1. **Start with round-robin** for stateless services with homogeneous backends. It is simple, predictable, and often good enough.
2. **Use least connections** when request durations vary significantly or when you have long-lived connections.
3. **Use consistent hashing** for caching layers where you want to maximize cache hit rates.
4. **Avoid IP hash** unless you have a specific reason for it — cookie-based session affinity at L7 is almost always a better choice for sticky sessions.
5. **Always configure health checks.** A load balancer without health checks is a liability.
6. **Monitor your load distribution.** Even with a good algorithm, things can drift. Track request rates, latencies, and error rates per backend.

Load balancing is a solved problem in the sense that the algorithms are well understood, but choosing the right one for your specific workload requires understanding your traffic patterns. Take the time to measure and iterate — your users will thank you.
