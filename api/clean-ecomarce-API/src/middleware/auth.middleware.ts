import { Request, Response, NextFunction } from 'express';

import { AdminRole } from '../modules/admin/admin.model';

// Extend Express Request type to include admin information
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

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const authorize = (...roles: AdminRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (!roles.includes(req.admin.role as AdminRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this resource'
      });
    }

    next();
  };
};

export const requirePermission = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const hasAllPermissions = requiredPermissions.every(permission => 
      req.admin?.permissions.includes('all') || 
      req.admin?.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
}; 

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log('isAuthenticated')
  console.log(req.isAuthenticated())
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized - Please login' });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (false) {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};

export const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user as { role: string }).role !== 'superadmin') {
    return res.status(403).json({ message: 'Forbidden - Super Admin access required' });
  }
  next();
};

