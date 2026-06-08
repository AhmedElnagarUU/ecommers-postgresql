export function getCustomerJwtSecret(): string {
  const secret = process.env.CUSTOMER_JWT_SECRET || process.env.SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CUSTOMER_JWT_SECRET or SESSION_SECRET must be set in production');
    }
    return 'dev-only-store-secret';
  }
  return secret;
}
