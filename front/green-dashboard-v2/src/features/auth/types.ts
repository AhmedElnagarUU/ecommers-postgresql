export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
  isActive?: boolean;
  lastLogin?: Date;
}

export interface AuthResponse {
  admin: Admin;
}
