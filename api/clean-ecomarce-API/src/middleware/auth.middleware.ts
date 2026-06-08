import { Request, Response, NextFunction } from 'express';
import { AdminRole } from '../modules/admin/admin.model';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

function getSessionAdmin(req: Request): { id: string; role: string; permissions?: string[] } | null {
  if (!req.isAuthenticated?.() || !req.user) return null;
  return req.user as { id: string; role: string; permissions?: string[] };
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
  next();
};

export const authorize = (...roles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = getSessionAdmin(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    if (!roles.includes(admin.role as AdminRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource',
      });
    }

    next();
  };
};

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = getSessionAdmin(req);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const permissions = admin.permissions ?? [];
    const hasAllPermissions = requiredPermissions.every(
      (permission) => permissions.includes('all') || permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated?.()) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const admin = getSessionAdmin(req);
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }

  if (admin.role !== AdminRole.ADMIN && admin.role !== AdminRole.SUPER_ADMIN) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }

  next();
};

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const admin = getSessionAdmin(req);
  if (!admin) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }

  if (admin.role !== AdminRole.SUPER_ADMIN) {
    return res.status(403).json({ message: 'Forbidden - Super Admin access required' });
  }

  next();
};
