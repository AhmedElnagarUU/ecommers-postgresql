export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
}

export interface IAdmin {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: Date | null;
  permissions: string[];
  refreshToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
