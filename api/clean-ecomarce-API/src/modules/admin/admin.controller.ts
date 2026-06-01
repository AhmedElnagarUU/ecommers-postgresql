import { NextFunction, Request, Response } from 'express';
import { AdminService } from './admin.service';
import { ApiResponse } from '../../utils/ApiResponse';
import passport from '../../config/passport';
import logger from '../../config/logger';

export class AdminController {
  constructor(private readonly adminService: AdminService) {
    logger.info('AdminController initialized');
  }

  async registerAdmin(req: Request, res: Response) {
    logger.debug(`[REGISTER ADMIN] Start`);
    logger.debug(`Body: ${JSON.stringify(req.body)}`);

    try {
      const admin = await this.adminService.registerAdmin(req.body);
      logger.info(`[REGISTER ADMIN] Success: ${admin.id}`);
      res.status(201).json(new ApiResponse(201, admin));
    } catch (error: any) {
      logger.error(`[REGISTER ADMIN] Error: ${error.message}`);
      res.status(400).json({ message: error.message });
    }
  }

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', (err: any, admin: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'error from passport' });
      }

      if (!admin) {
        return res.status(401).json({ message: 'invalid credential' });
      }

      req.login(admin, (err) => {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
      
        return res.json({
          success: true,
          data: { admin }
        });
      });
    })(req, res, next);
  }

  async getAllAdmins(req: Request, res: Response) {
    try {
      const query = req.query;
      const admins = await this.adminService.getAllAdmins(query);
      res.json(new ApiResponse(200, admins));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAdminById(req: Request, res: Response) {
    try {
      const admin = await this.adminService.getAdminById(req.params.id);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminService.updateAdmin(req.params.id, req.body);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteAdmin(req: Request, res: Response) {
    try {
      const admin = await this.adminService.deleteAdmin(req.params.id);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, { message: 'Admin deleted successfully' }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSuperAdmins(req: Request, res: Response) {
    try {
      const superAdmins = await this.adminService.getSuperAdmins();
      res.json(new ApiResponse(200, superAdmins));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async changeAdminStatus(req: Request, res: Response) {
    try {
      const { isActive } = req.body;
      const admin = await this.adminService.changeAdminStatus(req.params.id, isActive);
      if (!admin) {
        res.status(404).json({ message: 'Admin not found' });
        return;
      }
      res.json(new ApiResponse(200, admin));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async checkSuperAdmin(req: Request, res: Response) {
    try {
      const hasSuperAdmin = await this.adminService.hasSuperAdmin();
      res.json(new ApiResponse(200, { hasSuperAdmin }));
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async logoutAdmin(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }

      req.session.destroy((err) => {
        if (err) {
          return next(err);
        }

        res.clearCookie('connect.sid');
        res.json({
          success: true,
          message: 'logout successfully'
        });
      });
    });
  }
}
