# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository builds a custom Docker image of Caddy web server with Docker label support and
Cloudflare DNS integration. The image automatically configures itself as a reverse proxy by reading
Docker container labels.

Key features:

- Extends official Caddy image with `caddy-docker-proxy` and `cloudflare` plugins
- Multi-architecture support (linux/amd64, linux/arm64)
- Automated CI/CD pipeline pushing to GitHub Container Registry

## Development Commands

### Setup

```bash
# With mise (recommended)
mise run setup  # Installs tools and npm dependencies

# Without mise
npm install
```

### Building

```bash
# Build Docker image locally
docker build -t caddy-labels:latest .

# Test multi-platform build (like CI)
docker buildx build --platform linux/amd64,linux/arm64 .
```

### Linting

```bash
npm run lint          # Run all linters
npm run lint:docker   # Lint Dockerfile
npm run lint:markdown # Lint Markdown files
npm run lint:yaml     # Lint YAML workflows
npm run lint:fix      # Auto-fix Markdown issues
```

### Version Updates

To update Caddy version:

1. Edit `ARG CADDY_VERSION=2.10.0` in Dockerfile:1
2. Commit with message like: `fix: upgrade to Caddy 2.10.0 for Go 1.24 compatibility`

## Architecture

### Docker Build Process

The Dockerfile uses a multi-stage build:

1. **Builder stage**: Uses `caddy:${CADDY_VERSION}-builder` to compile Caddy with plugins
2. **Final stage**: Copies compiled binary to minimal `caddy:${CADDY_VERSION}-alpine` image

### CI/CD Pipeline

- **PR builds**: Test multi-platform builds without pushing
- **Main branch**: Builds and pushes to `ghcr.io/cpritchett/caddy-labels` with tags:
  - `latest`
  - `YYYYMMDD-HHmmss` (UTC timestamp)
  - Caddy version (e.g., `2.10.0`)

### Docker Label Configuration

The image reads Docker labels and translates them to Caddy configuration. Example:

```yaml
labels:
  caddy: "*.example.com"
  caddy.reverse_proxy: "{{upstreams 80}}"
  caddy.tls.dns: "cloudflare"
```

## Key Files

- `Dockerfile`: Main build configuration
- `package.json`: Development scripts and linting tools
- `.github/workflows/build.yaml`: CI/CD pipeline for Docker builds
- `.github/workflows/lint.yaml`: Code quality checks
- `.mise.toml`: Tool version management (Node.js, hadolint, etc.)

## Important Notes

- This is a Docker image project with no application code
- All development dependencies are Node.js-based for linting/tooling
- Commits must follow conventional commit format (enforced by commitlint)
- Pre-commit hooks run linters automatically via Husky
