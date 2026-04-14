import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import type { LoginCredentials, AuthResult } from '../types/auth.types';

// ── Helpers ───────────────────────────────────────────────────────────────────
function invalidCredentials(): never {
  throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
}

export class AuthService {
  /**
   * Validates credentials purely against the values set in the server .env file
   * (ADMIN_EMAIL / ADMIN_PASSWORD).  No database lookup is performed — the only
   * admin that can ever log in is the one configured in the environment.
   */
  static async login(credentials: LoginCredentials): Promise<AuthResult> {
    const { email, password } = credentials;

    // Ensure env creds are actually configured
    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
      console.error('[auth] ADMIN_EMAIL or ADMIN_PASSWORD is not set in .env');
      invalidCredentials();
    }

    // Case-insensitive email match; exact password match
    if (email.trim().toLowerCase() !== env.ADMIN_EMAIL.trim().toLowerCase()) {
      invalidCredentials();
    }

    if (password !== env.ADMIN_PASSWORD) {
      invalidCredentials();
    }

    const token = jwt.sign(
      { adminId: 'env-admin', email: env.ADMIN_EMAIL.toLowerCase() },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    const admin = {
      _id:      'env-admin',
      name:     'Admin',
      email:    env.ADMIN_EMAIL.toLowerCase(),
      isActive: true,
    };

    return { token, admin: admin as never };
  }

  /**
   * Returns the admin profile derived from env — no DB needed.
   */
  static async getProfile(_adminId: string) {
    if (!env.ADMIN_EMAIL) {
      throw Object.assign(new Error('Admin not configured'), { statusCode: 404 });
    }

    return {
      _id:      'env-admin',
      name:     'Admin',
      email:    env.ADMIN_EMAIL.toLowerCase(),
      isActive: true,
    };
  }
}
