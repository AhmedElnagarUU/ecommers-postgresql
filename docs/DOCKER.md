# Docker production deployment

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Copy `.env.example` to `.env` and set strong secrets

## Quick start

```bash
cp .env.example .env
# Edit .env — set POSTGRES_PASSWORD, SESSION_SECRET, CUSTOMER_JWT_SECRET, AWS_* , public URLs

docker compose build
docker compose up -d
```

| Service   | URL                      |
|-----------|--------------------------|
| API       | http://localhost:5000  |
| Dashboard | http://localhost:3000  |
| Store     | http://localhost:3001  |

## Production checklist

1. **Public URLs** — Set `PUBLIC_API_URL`, `PUBLIC_DASHBOARD_URL`, `PUBLIC_STORE_URL`, and `NEXT_PUBLIC_API_URL` to your real HTTPS domains (used for CORS and browser API calls).
2. **Rebuild frontends** after changing `NEXT_PUBLIC_*` (values are embedded at build time).
3. **Secrets** — Use long random values for `SESSION_SECRET`, `CUSTOMER_JWT_SECRET`, and `POSTGRES_PASSWORD`.
4. **TLS** — Put nginx, Caddy, or a cloud load balancer in front of ports 3000/3001/5000; do not expose Postgres publicly.
5. **Migrations** — Applied automatically on API container start via `prisma migrate deploy`.
6. **Seed (optional)** — `docker compose exec api node scripts/seed.js`

## Commands

```bash
# Logs
docker compose logs -f api

# Restart a service
docker compose restart api

# Stop stack
docker compose down

# Stop and remove database volume (destructive)
docker compose down -v
```

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  dashboard  │     │    store     │     │     api     │
│   :3000     │────▶│    :3001     │────▶│    :5000    │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                          ┌──────▼──────┐
                                          │  postgres   │
                                          │    :5432    │
                                          └─────────────┘
```

- `restart: unless-stopped` on all services
- Healthchecks gate startup order (`postgres` → `api` → frontends)
- Store SSR uses `API_INTERNAL_URL=http://api:5000/api/v1` inside the cluster
