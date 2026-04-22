import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminUser } from '../models/AdminUser';
import type { LoginCredentials, AuthResult } from '../types/auth.types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function invalidCredentials(): never {
  throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
}

export class AuthService {
  /**
   * Validates credentials against the `AdminUser` collection in MongoDB.
   * Admins can only be provisioned through the gated `createAdminUser` script,
   * so there is no public signup endpoint.
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    const admin = await AdminUser.findOne({
      email: email.trim().toLowerCase(),
    });
    if (!admin || !admin.isActive) invalidCredentials();

    const ok = await admin.comparePassword(password);
    if (!ok) invalidCredentials();

    const adminId = admin._id.toString();
    const token = jwt.sign(
      { adminId, email: admin.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    return {
      token,
      admin: {
        _id:      adminId,
        name:     admin.name,
        email:    admin.email,
        isActive: admin.isActive,
      } as never,
    };
  }

  /**
   * Returns the admin profile for the id embedded in the JWT.
   */
  static async getProfile(adminId: string) {
    const admin = await AdminUser.findById(adminId);
    if (!admin || !admin.isActive) {
      throw Object.assign(new Error('Admin not found'), { statusCode: 404 });
    }
    return {
      _id:      admin._id.toString(),
      name:     admin.name,
      email:    admin.email,
      isActive: admin.isActive,
    };
  }
}
