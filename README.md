# cpritchett/caddy-labels

<!-- Header -->
<div id="top" align="center">
  <br />

  <!-- Logo -->
  <img src="https://git.zakscode.com/repo-avatars/e6c86b62a0a3a3183b131dc90ffbbffdf653002d36954748e29dee7a4866350e"
       alt="Logo" width="200" height="200">

  <!-- Description -->
  Caddy with Docker Label Support & Cloudflare

  <!-- Repo badges -->
  [![Pull Requests](https://img.shields.io/github/issues-pr/cpritchett/caddy-labels?style=for-the-badge)](https://github.com/cpritchett/caddy-labels/pulls)
  [![Issues](https://img.shields.io/github/issues/cpritchett/caddy-labels?style=for-the-badge)](https://github.com/cpritchett/caddy-labels/issues)

</div>

## Table of Contents

- [cpritchett/caddy-labels](#top)
  - [About](#about)
    - [Built With](#built-with)
  - [Setup](#setup)
    - [Production](#production)
    - [Development](#development)
  - [Versioning](#versioning)
  - [License](#license)

## About

Caddy with docker label support & Cloudflare

- [Cloudflare](https://github.com/caddy-dns/cloudflare)
- [caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy)

This image will inspect container labels & translate them into a caddy config
like so:

```yml
services:
  server:
    ...
    networks:
      - proxy_network
    deploy:
      labels:
        # *.example.com {
        - caddy: '*.example.com'
        # revere_proxy <DOCKER IP>:80
        - caddy.reverse_proxy: {{upstreams 80}}
        # tls { dns cloudflare }
        - caddy.tls.dns: cloudflare
        # }
```

Other useful patterns:

```yml
# Load-balance sockets
caddy.reverse_proxy.lb_policy: client_ip_hash
# Multiple domains
caddy: a.example.com b.example.com
caddy.@match0.host: a.example.com
caddy.@match1.host: b.example.com
caddy.0_reverse_proxy: '@match0 {{upstreams 80}}'
caddy.1_reverse_proxy: '@match1 {{upstreams 81}}'
# Whitelist network
caddy.@local.remote_ip: '192.168.0.0/24'
caddy.handle: '@local'
caddy.handle.reverse_proxy: '{{upstreams 3000}}'
```

See [caddy-docker-proxy](https://github.com/lucaslorentz/caddy-docker-proxy) for more information

### Built With

[![Docker](https://img.shields.io/badge/Docker-384d54?style=for-the-badge&logo=docker)](https://docker.com/)

## Setup

### Production

#### Prerequisites

- [Docker](https://docs.docker.com/get-started/get-docker/)

#### Instructions

1. Create a compose file:

```yml
services:
  caddy:
    image: cpritchett/caddy-labels:latest
    environment:
      CADDY_INGRESS_NETWORKS: proxy_network
      TZ: America/Toronto
    ports:
     - 80:80
     - 443:443
    volumes:
     - data:/data/caddy
     - /var/run/docker.sock:/var/run/docker.sock
    networks:
     - proxy_network
    deploy:
      mode: global
      labels:
        caddy.email: example@example.com
        # Cloudflare
        caddy.acme_dns: 'cloudflare TOKEN'

networks:
  proxy_network:

volumes:
  data:
```

1. Deploy: `docker compose up`

### Development

#### Development Prerequisites

- [Docker](https://docs.docker.com/get-started/get-docker/)
- [mise](https://mise.jdx.dev/) (recommended) or
  [Node.js](https://nodejs.org/)

#### Build Instructions

1. Update desired version number in Dockerfile
1. Build docker image: `docker build -t cpritchett/caddy-labels:latest .`

#### Linting

This project includes comprehensive linting for code quality:

**Setup with mise (recommended):**

```bash
mise run setup  # Install all tools and dependencies
```

**Setup without mise:**

```bash
npm install  # Install Node.js dependencies
# Install hadolint manually for your platform
```

**Available commands:**

```bash
npm run lint          # Run all linters
npm run lint:docker   # Lint Dockerfile with hadolint
npm run lint:markdown # Lint Markdown files
npm run lint:yaml     # Lint YAML files with ESLint
npm run lint:fix      # Auto-fix Markdown issues
```

**Tools included:**

- **Hadolint** - Dockerfile linting and security checks
- **markdownlint** - Markdown formatting and style
- **eslint-plugin-yml** - YAML syntax and style via ESLint
- **commitlint** - Conventional commit message format
- **Husky** - Git hooks for pre-commit linting

**Git hooks:**

- Pre-commit: Runs all linters before allowing commits
- Commit-msg: Validates commit message format

## Versioning

This project uses [Release Please](https://github.com/googleapis/release-please) for automated
versioning and release management based on
[Conventional Commits](https://www.conventionalcommits.org/).

### Version Tags

Docker images are tagged with multiple formats:

- **Semantic Version Tags**: `1.0.0`, `1.0`, `1` (created on releases)
- **Caddy Version Tag**: `caddy-2.10.0` (always includes the Caddy version)
- **Latest Tag**: `latest` (always points to the most recent main branch build)
- **Timestamp Tag**: `YYYYMMDD-HHmmss` (for each main branch build)

### Release Process

1. Commits to `main` using conventional commit format trigger Release Please
2. Release Please creates/updates a release PR with:
   - Automated CHANGELOG updates
   - Version information in git tags
3. When the release PR is merged, a GitHub release is created
4. The release triggers Docker image builds with versioned tags

### Commit Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features (bumps minor version)
- `fix:` - Bug fixes (bumps patch version)
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes
- Add `!` or `BREAKING CHANGE:` for breaking changes (bumps major version)

Example: `feat: add support for new Caddy plugin`

## License

Copyright © 2023 cpritchett | Available under MIT Licensing

See the [license](LICENSE) for more information.
