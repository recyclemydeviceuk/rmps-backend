import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AdminUser } from '../models/AdminUser';
import { Otp } from '../models/Otp';
import { EmailService } from './email.service';
import type { AuthResult, SendOtpInput, VerifyOtpInput } from '../types/auth.types';

const OTP_TTL_MINUTES = 10;

function generateOtp(): string {
  return crypto.randomInt(100_000, 999_999).toString();
}

function unauthorized(msg = 'Invalid or expired OTP'): never {
  throw Object.assign(new Error(msg), { statusCode: 401 });
}

export class AuthService {
  static async sendOtp({ email }: SendOtpInput): Promise<void> {
    const normalised = email.trim().toLowerCase();

    const admin = await AdminUser.findOne({ email: normalised });
    if (!admin || !admin.isActive) {
      throw Object.assign(new Error('No admin account found for that email address'), { statusCode: 404 });
    }

    // Invalidate any previous unused OTPs for this email
    await Otp.deleteMany({ email: normalised });

    const code      = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({ email: normalised, code, expiresAt });
    await EmailService.sendAdminOtp(admin.email, admin.name, code);
  }

  static async verifyOtp({ email, code }: VerifyOtpInput): Promise<AuthResult> {
    const normalised = email.trim().toLowerCase();

    const record = await Otp.findOne({ email: normalised, used: false }).sort({ createdAt: -1 });

    if (!record || record.code !== code || record.expiresAt < new Date()) {
      unauthorized();
    }

    // Mark used so it cannot be replayed
    record.used = true;
    await record.save();

    const admin = await AdminUser.findOne({ email: normalised });
    if (!admin || !admin.isActive) unauthorized('Admin account not found or inactive');

    const adminId = admin._id.toString();
    const token   = jwt.sign(
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
