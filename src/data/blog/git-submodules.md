---
title: "Working with Git Submodules"
description: "A practical guide to Git submodules covering how to add, update, and clone repositories with submodules, along with common pitfalls and best practices."
pubDate: 2019-11-15
tags: ["git", "developer-tools"]
---

Git submodules allow you to include one Git repository as a subdirectory of another. They are useful for managing dependencies, sharing libraries across projects, or including third-party code that you want to pin to a specific version. However, submodules have a reputation for being confusing and error-prone. In this post, I will demystify submodules by explaining how they work, walking through common operations, and highlighting the pitfalls that trip up most developers.

## What Are Submodules?

A Git submodule is a reference to a specific commit in another Git repository. When you add a submodule to your project, Git stores two pieces of information:

1. **The URL of the external repository** — stored in `.gitmodules`
2. **The specific commit hash** — stored in the parent repository's tree

The submodule's files are not stored in your repository. Instead, Git records a pointer to a commit in the external repository. When someone clones your project, they need to initialize and fetch the submodule separately (or use `--recursive`).

Think of it like a symlink, but instead of pointing to a directory, it points to a specific commit in another repository.

## Adding a Submodule

To add a submodule:

```bash
git submodule add https://github.com/example/library.git libs/library
```

This does several things:

1. Clones the repository into `libs/library/`
2. Creates (or updates) the `.gitmodules` file:
   ```ini
   [submodule "libs/library"]
       path = libs/library
       url = https://github.com/example/library.git
   ```
3. Stages the `.gitmodules` file and the submodule reference

You then commit these changes:

```bash
git add .gitmodules libs/library
git commit -m "Add library as submodule"
```

If you run `git diff --cached`, you will see that the submodule is recorded as a special "commit" entry, not as regular file content:

```
+Subproject commit a1b2c3d4e5f6...
```

## Cloning a Repository with Submodules

When someone clones a repository that contains submodules, the submodule directories will be empty by default. There are two ways to handle this:

### Option 1: Clone with --recursive

```bash
git clone --recursive https://github.com/example/project.git
```

This clones the main repository and all submodules in one step. For nested submodules (submodules within submodules), use `--recurse-submodules`.

### Option 2: Initialize after cloning

If you already cloned without `--recursive`:

```bash
git submodule init
git submodule update
```

Or in one step:

```bash
git submodule update --init --recursive
```

`git submodule init` registers the submodule paths from `.gitmodules` into your local `.git/config`. `git submodule update` fetches the submodule content and checks out the recorded commit.

## Updating Submodules

This is where confusion often begins. There are two different kinds of "update":

### Updating to the latest commit in the submodule

If you want to pull the latest changes from the submodule's remote:

```bash
cd libs/library
git fetch
git checkout main
git pull
cd ../..
```

Or, more conveniently:

```bash
git submodule update --remote libs/library
```

This fetches the latest commit from the submodule's tracking branch (default: the remote's HEAD) and checks it out. After doing this, the parent repository shows a change:

```bash
git status
# modified:   libs/library (new commits)
```

You need to commit this change in the parent repository:

```bash
git add libs/library
git commit -m "Update library submodule to latest"
```

### Updating to the commit recorded in the parent

When you pull changes in the parent repository and someone else has updated the submodule reference:

```bash
git pull
git submodule update
```

`git submodule update` (without `--remote`) checks out the commit that the parent repository has recorded. This is the more common operation — you are syncing to whatever version the team agreed on.

## Making Changes Inside a Submodule

You can make changes inside a submodule directory, commit them, and push them to the submodule's remote:

```bash
cd libs/library
# make changes
git add .
git commit -m "Fix bug in library"
git push
cd ../..
```

Then update the reference in the parent:

```bash
git add libs/library
git commit -m "Point to fixed version of library"
git push
```

Important: always push the submodule changes before pushing the parent. Otherwise, others who pull the parent will have a reference to a commit that does not exist in the submodule's remote.

## Common Pitfalls

### Detached HEAD State

When you run `git submodule update`, the submodule is checked out in a detached HEAD state — it is at a specific commit but not on any branch. If you make changes and commit without first creating or checking out a branch, those commits could be lost.

Always check out a branch before making changes:

```bash
cd libs/library
git checkout main
# now make changes
```

### Forgetting to Push Submodule Changes

If you update a submodule, commit the reference in the parent, and push the parent — but forget to push the submodule — others will get an error:

```
fatal: reference is not a tree: a1b2c3d4...
```

Prevent this with:

```bash
git push --recurse-submodules=check
```

This refuses to push the parent if any submodule commits have not been pushed. You can make this the default:

```bash
git config push.recurseSubmodules check
```

### Merge Conflicts in Submodule References

When two branches modify the submodule reference, you get a merge conflict. The conflict looks different from file conflicts:

```
CONFLICT (submodule): Merge conflict in libs/library
```

To resolve, decide which commit the submodule should point to, check it out in the submodule directory, and stage it:

```bash
cd libs/library
git checkout <desired-commit>
cd ../..
git add libs/library
git commit
```

### Accidental Commits of Dirty Submodules

If you have uncommitted changes in a submodule and run `git add .` in the parent, Git may stage a different submodule reference than intended. Use `git diff --submodule` to see exactly what changed before committing.

## Removing a Submodule

Removing a submodule is more involved than adding one:

```bash
# Remove the submodule entry from .gitmodules
git config -f .gitmodules --remove-section submodule.libs/library

# Remove the submodule entry from .git/config
git config --remove-section submodule.libs/library

# Remove the submodule directory and the entry in .git/modules
git rm --cached libs/library
rm -rf libs/library
rm -rf .git/modules/libs/library

# Commit the changes
git add .gitmodules
git commit -m "Remove library submodule"
```

In Git 2.12+, `git rm libs/library` handles most of these steps automatically.

## Alternatives to Submodules

Before reaching for submodules, consider whether an alternative fits better:

- **Package managers** (npm, pip, Maven, Go modules): If the dependency is published as a package, use your language's package manager. It handles versioning, resolution, and caching much better than submodules.
- **Git subtree**: Merges the external repository's content directly into your tree. No special commands needed for cloning or pulling. Changes are harder to push back upstream, but day-to-day usage is simpler.
- **Monorepo**: If you control both repositories and they are tightly coupled, consider merging them into a single repository.

Submodules are best when you need to pin a specific version of an external repository that is not available as a package, and you want a clear separation between the repositories.

Despite their quirks, submodules are a powerful tool when used appropriately. The key is understanding the mental model — a submodule is a pointer to a commit — and being disciplined about the push-then-push workflow.
