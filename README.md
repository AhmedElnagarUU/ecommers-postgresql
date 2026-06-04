# E-commerce monorepo

Full-stack COD (cash on delivery) store with admin dashboard and public storefront.

| App | Path | Default port |
|-----|------|----------------|
| API | `api/clean-ecomarce-API` | `5000` |
| Dashboard | `front/green-dashboard-v2` | `3000` |
| Storefront | `store` | `3001` |

## Prerequisites

- Node.js 18+
- PostgreSQL
- AWS S3 bucket (product images; optional for local dev if uploads are skipped)

## Environment variables

### API (`api/clean-ecomarce-API/.env`)

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ecommerce
SESSION_SECRET=your-session-secret
CUSTOMER_JWT_SECRET=your-customer-jwt-secret

# AWS S3 (product images)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=

# Optional
PORT=5000
FRONTEND_URL=http://localhost:3000
STORE_URL=http://localhost:3001
```

### Dashboard (`front/green-dashboard-v2/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Storefront (`store/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## First-time setup

```bash
# 1. API
cd api/clean-ecomarce-API
npm install
npx prisma migrate deploy
npx prisma generate
npm run seed

# 2. Dashboard
cd ../../front/green-dashboard-v2
npm install

# 3. Storefront
cd ../../store
npm install
```

## Run locally

```bash
# Terminal 1 — API
cd api/clean-ecomarce-API && npm run dev

# Terminal 2 — Dashboard
cd front/green-dashboard-v2 && npm run dev

# Terminal 3 — Storefront
cd store && npm run dev
```

- Storefront: http://localhost:3001  
- Dashboard: http://localhost:3000  
- API health: http://localhost:5000/api/v1 (routes under `/api/v1`)

## Admin access

After seeding, use the admin credentials from `api/clean-ecomarce-API/scripts/seed.js` (or register via `POST /api/v1/admin/register`).

Login at `/login` on the dashboard. Session cookies require `withCredentials: true` (already configured in the dashboard axios client).

## MVP checkout flow

1. Browse products on the storefront  
2. Add to cart (guest or logged-in)  
3. Checkout with shipping details — payment method is COD  
4. Track order via email + order number  

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Prisma client missing | Run `npx prisma generate` in the API folder |
| CORS errors | Set `FRONTEND_URL` / `STORE_URL` in API `.env` to match your dev URLs |
| Product links 404 | Ensure API returns `id`; storefront maps it to `_id` via `normalize-store` |
| Orders list empty in dashboard | Confirm orders exist in DB; list filter requires matching status values |

## Project structure

```
api/clean-ecomarce-API/   Express + Prisma + PostgreSQL
front/green-dashboard-v2/ Next.js admin dashboard
store/                    Next.js public storefront
```
