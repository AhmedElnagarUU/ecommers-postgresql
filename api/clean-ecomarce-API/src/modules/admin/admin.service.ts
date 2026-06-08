import bcrypt from 'bcrypt';
import { prisma } from '../../config/database';
import { AdminRole } from './admin.model';
import logger from '../../config/logger';

export class AdminService {
  constructor() {
    logger.info('AdminService initialized');
  }

  async registerAdmin(adminData: any): Promise<any> {
    const hasSuperAdmin = await this.hasSuperAdmin();
    if (!hasSuperAdmin) {
      adminData.role = AdminRole.SUPER_ADMIN;
      adminData.permissions = ['all'];
    } else if (!adminData.permissions) {
      adminData.permissions = adminData.role === AdminRole.SUPER_ADMIN
        ? ['all']
        : ['read', 'write'];
    }

    const hashed = await bcrypt.hash(adminData.password, 10);
    return await prisma.admin.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashed,
        role: adminData.role ?? AdminRole.ADMIN,
        isActive: adminData.isActive ?? true,
        permissions: adminData.permissions,
      },
    });
  }

  async getAllAdmins(query: any = {}): Promise<any[]> {
    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.isActive !== undefined) where.isActive = query.isActive === 'true' || query.isActive === true;
    return await prisma.admin.findMany({ where, omit: { password: true, refreshToken: true } });
  }

  async getAdminById(id: string): Promise<any> {
    return await prisma.admin.findUnique({
      where: { id },
      omit: { password: true, refreshToken: true },
    });
  }

  /** Used internally by passport — returns password for bcrypt.compare */
  async getAdminByEmailWithPassword(email: string): Promise<any> {
    return await prisma.admin.findUnique({ where: { email } });
  }

  async getAdminByEmail(email: string): Promise<any> {
    return await prisma.admin.findUnique({
      where: { email },
      omit: { password: true, refreshToken: true },
    });
  }

  async updateAdmin(id: string, updateData: any): Promise<any> {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new Error('Admin not found');

    if (admin.role === AdminRole.SUPER_ADMIN && updateData.role === AdminRole.ADMIN) {
      const hasSuperAdmin = await this.hasSuperAdmin();
      if (!hasSuperAdmin) {
        throw new Error('Cannot change role: At least one super admin must exist');
      }
    }

    const data: any = { ...updateData };
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return await prisma.admin.update({
      where: { id },
      data,
      omit: { password: true, refreshToken: true },
    });
  }

  async deleteAdmin(id: string): Promise<any> {
    const admin = await prisma.admin.findUnique({ where: { id } });
    if (!admin) throw new Error('Admin not found');

    if (admin.role === AdminRole.SUPER_ADMIN) {
      const hasSuperAdmin = await this.hasSuperAdmin();
      if (!hasSuperAdmin) {
        throw new Error('Cannot delete: At least one super admin must exist');
      }
    }

    return await prisma.admin.delete({ where: { id } });
  }

  async getSuperAdmins(): Promise<any[]> {
    return await prisma.admin.findMany({
      where: { role: AdminRole.SUPER_ADMIN },
      omit: { password: true, refreshToken: true },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await prisma.admin.update({ where: { id }, data: { lastLogin: new Date() } });
  }

  async changeAdminStatus(id: string, isActive: boolean): Promise<any> {
    return await prisma.admin.update({
      where: { id },
      data: { isActive },
      omit: { password: true, refreshToken: true },
    });
  }

  async hasSuperAdmin(): Promise<boolean> {
    const count = await prisma.admin.count({ where: { role: AdminRole.SUPER_ADMIN } });
    return count > 0;
  }

  async getAdminProfile(id: string): Promise<any> {
    return await prisma.admin.findUnique({
      where: { id },
      omit: { password: true, refreshToken: true },
    });
  }
}
