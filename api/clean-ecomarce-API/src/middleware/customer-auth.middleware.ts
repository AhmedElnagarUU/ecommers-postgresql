import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      customer?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export const isCustomerAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Login required' });
  }

  try {
    const secret = process.env.CUSTOMER_JWT_SECRET || process.env.SESSION_SECRET || 'store-secret';
    const payload = jwt.verify(token, secret) as { id: string; email: string; name: string };
    req.customer = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const optionalCustomerAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) return next();

  try {
    const secret = process.env.CUSTOMER_JWT_SECRET || process.env.SESSION_SECRET || 'store-secret';
    const payload = jwt.verify(token, secret) as { id: string; email: string; name: string };
    req.customer = payload;
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
