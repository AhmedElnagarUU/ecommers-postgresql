import { AdminModel, AdminRole } from './admin.model';
import logger from '../../config/logger';

export class AdminService {
  constructor() {
    logger.info('AdminService initialized');
  }

  async registerAdmin(adminData: any): Promise<any> {
    if (!adminData.permissions) {
      adminData.permissions = adminData.role === AdminRole.SUPER_ADMIN 
        ? ['all'] 
        : ['read', 'write'];
    }
    return await AdminModel.create(adminData);
  }

  async getAllAdmins(query: any = {}): Promise<any[]> {
    return await AdminModel.find(query);
  }

  async getAdminById(id: string): Promise<any> {
    return await AdminModel.findById(id);
  }

  async getAdminByEmail(email: string): Promise<any> {
    return await AdminModel.findOne({ email });
  }

  async updateAdmin(id: string, updateData: any): Promise<any> {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    if (admin.role === AdminRole.SUPER_ADMIN && updateData.role === AdminRole.ADMIN) {
      const superAdminCount = await this.hasSuperAdmin();
      if (!superAdminCount) {
        throw new Error('Cannot change role: At least one super admin must exist');
      }
    }

    return await AdminModel.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
  }

  async deleteAdmin(id: string): Promise<any> {
    const admin = await AdminModel.findById(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    if (admin.role === AdminRole.SUPER_ADMIN) {
      const superAdminCount = await this.hasSuperAdmin();
      if (!superAdminCount) {
        throw new Error('Cannot delete: At least one super admin must exist');
      }
    }

    return await AdminModel.findByIdAndDelete(id);
  }

  async getSuperAdmins(): Promise<any[]> {
    return await AdminModel.find({ role: AdminRole.SUPER_ADMIN });
  }

  async updateLastLogin(id: string): Promise<void> {
    await AdminModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async changeAdminStatus(id: string, isActive: boolean): Promise<any> {
    return await AdminModel.findByIdAndUpdate(id, { isActive }, { new: true });
  }

  async hasSuperAdmin(): Promise<boolean> {
    const count = await AdminModel.countDocuments({ role: AdminRole.SUPER_ADMIN });
    return count > 0;
  }

  async getAdminProfile(id: string): Promise<any> {
    return await AdminModel.findById(id).select('-password -refreshToken');
  }
}
