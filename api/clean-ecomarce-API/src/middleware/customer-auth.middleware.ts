import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getCustomerJwtSecret } from '../utils/jwt-secret';

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

function verifyCustomerToken(token: string) {
  const secret = getCustomerJwtSecret();
  return jwt.verify(token, secret) as { id: string; email: string; name: string };
}

export const isCustomerAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Login required' });
  }

  try {
    req.customer = verifyCustomerToken(token);
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
    req.customer = verifyCustomerToken(token);
  } catch {
    // ignore invalid token for optional auth
  }
  next();
};
