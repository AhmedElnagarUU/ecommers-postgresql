import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../modules/admin/admin.service';
import { isSuperAdmin } from './auth.middleware';

const adminService = new AdminService();

/** Allow open registration only until the first super admin exists. */
export const allowAdminRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hasSuperAdmin = await adminService.hasSuperAdmin();
    if (!hasSuperAdmin) {
      return next();
    }
    return isSuperAdmin(req, res, next);
  } catch {
    return res.status(500).json({ message: 'Unable to verify admin registration policy' });
  }
};
