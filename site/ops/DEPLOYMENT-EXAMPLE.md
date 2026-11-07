# Deployment example — not the production deployment

These scripts are a reviewed **example**. They have only been exercised against local temporary directories and a mock `curl`; they do not establish the state or safety of the live VPS. No infrastructure is configured by this change.

## Prepare an artifact (from `site/`, after committing the source)

```sh
npm ci
node ops/package-release.mjs /absolute/path/to/a-new-artifact-directory
```

Packaging requires a clean Git worktree, runs typecheck, regressions and the full validated build, checks that the revision/worktree did not change, then copies `dist` into a fresh directory and records the full Git revision, verification timestamp, and SHA-256 of every file in `release.json`. This is integrity metadata, **not a cryptographic signature**. Transfer only your trusted artifact; the tar stream is not an untrusted-upload endpoint.

## Deployment (requires separate explicit authorization; do not run for review)

```sh
ROOT=/srv/opcvibestack RELEASE_ID=unique-release-id \
ARTIFACT_DIR=/absolute/path/to/artifact REMOTE=user@host \
PROBE_ORIGIN=https://your-origin.example bash ops/deploy.sh.example
```

The local wrapper needs Python 3, tar and SSH. The target needs Bash, GNU tar/coreutils, `flock`, Python 3 and curl. SSH host-key verification remains enabled. `ROOT` must be an absolute, non-symlink path without spaces or trailing slash. The origin must serve `ROOT/current` directly, without HTML rewriting; probes compare bytes, not merely HTTP 200. Confirm nginx paths, permissions, cache behavior and probe policy separately before adopting this example.

One nonblocking lock covers receiving, validating, activation and probes. Release and record directories must be new; an ID is never reused. There is no `rsync --delete` and deployment never rebuilds. The helper verifies the exact artifact file set and checksums before changing `current`, preserves the previous target, atomically changes the symlink, then compares the served release manifest, EN/ZH homepages and sitemap bytes. Failures after activation restore the previous target (or remove the first activation when no previous release existed). Failed release directories and status/previous-target records remain for inspection; only temporary symlinks/probe files are cleaned. No automatic release pruning is included.

Limitations: SIGKILL, machine/power loss and filesystem failures cannot be handled by shell traps; monitor and recover manually. Rollback is not proof that the old release is healthy. CDN caches, gzip/HTML transformations and authentication can cause conservative rollback. This is not blue/green application or database deployment. The live production mechanism has **not** been inspected or changed.

## Local-only safety regression

```sh
node --test tests/deploy.test.mjs
```

Tests use a generated fixture archive and a PATH-scoped mock curl. They cover initial activation, reused-ID refusal, bad checksum refusal, failed-probe rollback, invalid ID, and concurrent-deployment lock refusal. No SSH, VPS, production probe or network deployment is involved.
