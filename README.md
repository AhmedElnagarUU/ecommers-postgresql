# E-commerce monorepo

Full-stack COD (cash on delivery) store with admin dashboard and public storefront.

| App | Path | Default port |
|-----|------|----------------|
| API | `api/clean-ecomarce-API` | `5000` |
| Dashboard | `front/green-dashboard-v2` | `3000` |
| Storefront | `store` | `3001` |

## Docker (production)

```bash
cp .env.example .env
# Edit .env with secrets and public URLs
docker compose build
docker compose up -d
```

See [docs/DOCKER.md](docs/DOCKER.md) for the full production guide.

## Local development

### Prerequisites

- Node.js 18+
- PostgreSQL
- AWS S3 bucket (product images)

### API (`api/clean-ecomarce-API/.env`)

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/ecommerce
SESSION_SECRET=your-session-secret
CUSTOMER_JWT_SECRET=your-customer-jwt-secret
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
AWS_BUCKET_NAME=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
ADMIN_EMAIL=
PORT=5000
FRONTEND_URL=http://localhost:3000
STORE_URL=http://localhost:3001
```

### Dashboard / Storefront

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### Setup

```bash
cd api/clean-ecomarce-API && npm install && npx prisma migrate deploy && npx prisma generate && npm run seed
cd ../../front/green-dashboard-v2 && npm install
cd ../../store && npm install
```

### Run

```bash
cd api/clean-ecomarce-API && npm run dev
cd front/green-dashboard-v2 && npm run dev
cd store && npm run dev
```
