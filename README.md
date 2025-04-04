<!-- Header -->
<div id="top" align="center">
  <br />

  <!-- Logo -->
  <img src="https://git.zakscode.com/repo-avatars/e6c86b62a0a3a3183b131dc90ffbbffdf653002d36954748e29dee7a4866350e" alt="Logo" width="200" height="200">

  <!-- Title -->
### ztimson/caddy-labels

  <!-- Description -->
Caddy with Docker Label Support, Cloudflare & Route53

  <!-- Repo badges -->
[![Version](https://img.shields.io/badge/dynamic/json.svg?label=Version&style=for-the-badge&url=https://git.zakscode.com/api/v1/repos/ztimson/caddy-labels/tags&query=$[0].name)](https://git.zakscode.com/ztimson/caddy-labels/tags)
[![Pull Requests](https://img.shields.io/badge/dynamic/json.svg?label=Pull%20Requests&style=for-the-badge&url=https://git.zakscode.com/api/v1/repos/ztimson/caddy-labels&query=open_pr_counter)](https://git.zakscode.com/ztimson/caddy-labels/pulls)
[![Issues](https://img.shields.io/badge/dynamic/json.svg?label=Issues&style=for-the-badge&url=https://git.zakscode.com/api/v1/repos/ztimson/caddy-labels&query=open_issues_count)](https://git.zakscode.com/ztimson/caddy-labels/issues)

</div>

## Table of Contents
- [ztimson/caddy-labels](#top)
    - [About](#about)
        - [Built With](#built-with)
    - [Setup](#setup)
        - [Production](#production)
        - [Development](#development)
    - [License](#license)

## About

Caddy with docker label support, Cloudflare & Route53
 - [AWS Route53](https://github.com/caddy-dns/route53)
 - [Cloudflare](https://github.com/caddy-dns/cloudflare)
 - [caddy-docker-proxy](github.com/lucaslorentz/caddy-docker-proxy)

This image will inspect container labels & translate them into a caddy config like so:
```yml
services:
  server:
    ...
    networks:
      - proxy_network
    deploy:
      labels:
        - caddy: '*.example.com'                        # *.example.com {
        - caddy.reverse_proxy: {{upstreams 80}}         #     revere_proxy <DOCKER IP>:80
        - caddy.tls.dns: cloudflare                     #     tls { dns cloudflare } 
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

See [caddy-docker-proxy](github.com/lucaslorentz/caddy-docker-proxy) for more information

### Built With
[![Docker](https://img.shields.io/badge/Docker-384d54?style=for-the-badge&logo=docker)](https://docker.com/)

## Setup

<details>
<summary>
  <h3 id="production" style="display: inline">
    Production
  </h3>
</summary>

#### Prerequisites
- [Docker](https://docs.docker.com/get-started/get-docker/)

#### Instructions
1. Create a compose file:
```yml
services:
  caddy:
    image: ztimson/caddy-labels:latest
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
        # OR Route53
        caddy.acme_dns: route53
        caddy.acme_dns.region: 'us-east-1'
        caddy.acme_dns.access_key_id: 'TOKEN'
        caddy.acme_dns.secret_access_key: 'TOKEN'

networks:
  proxy_network:

volumes:
  data:
```
2. Deploy: `docker compose up`

</details>

<details>
<summary>
  <h3 id="development" style="display: inline">
    Development
  </h3>
</summary>

#### Prerequisites
- [Docker](https://docs.docker.com/get-started/get-docker/)

#### Instructions
1. Update desired version number in Dockerfile
2. Build docker image: `docekr build -t ztimson/caddy-labels:latest .`

</details>

## License

Copyright © 2023 Zakary Timson | Available under MIT Licensing

See the [license](LICENSE) for more information.
