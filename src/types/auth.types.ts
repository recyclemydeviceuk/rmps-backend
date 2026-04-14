export type AdminRole = 'super-admin';

export interface AdminUser {
  _id:       string;
  name:      string;
  email:     string;
  isActive:  boolean;
  createdAt: Date;
}

export interface LoginCredentials {
  email:    string;
  password: string;
}

export interface AuthResult {
  token: string;
  admin: AdminUser;
}

export interface JwtPayload {
  adminId: string;
  email:   string;
  iat?:    number;
  exp?:    number;
}
