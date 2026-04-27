export interface AdminUser {
  _id:       string;
  name:      string;
  email:     string;
  isActive:  boolean;
  createdAt: Date;
}

export interface SendOtpInput {
  email: string;
}

export interface VerifyOtpInput {
  email: string;
  code:  string;
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
