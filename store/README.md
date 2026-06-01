# Storefront (Next.js)

Customer-facing shop connected to the Express API.

## Setup

1. Copy env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Set API URL (default Express port):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

3. In `api/clean-ecomarce-API`, ensure CORS allows `http://localhost:3001` (already configured).

4. Install and run:
   ```bash
   npm install
   npm run dev
   ```

Store runs at **http://localhost:3001**

## Features

- Product catalog with search, category & price filters
- Product variants
- Cart (API when logged in, localStorage for guests)
- Guest or account checkout (cash on delivery)
- Register / login (JWT)
- Order history & track order (email + order number)
- English / Arabic (RTL)

## API routes used

All under `/api/v1/store`:

- `GET /categories`, `GET /products`, `GET /products/:id`
- `POST /auth/register`, `POST /auth/login`
- `GET|PUT /cart` (auth required)
- `POST /orders` (guest or auth)
- `GET /orders` (auth), `GET /orders/track`
