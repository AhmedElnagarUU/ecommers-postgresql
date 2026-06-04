#!/bin/sh
set -e

echo "[api] Running database migrations..."
npx prisma migrate deploy

echo "[api] Starting application..."
exec "$@"
