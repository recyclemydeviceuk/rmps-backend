import { Schema, model, Document } from 'mongoose';

export interface IOtpDoc extends Document {
  email:     string;
  code:      string;
  expiresAt: Date;
  used:      boolean;
}

const otpSchema = new Schema<IOtpDoc>({
  email:     { type: String, required: true, lowercase: true, trim: true },
  code:      { type: String, required: true },
  expiresAt: { type: Date,   required: true },
  used:      { type: Boolean, default: false },
});

// MongoDB auto-deletes documents once expiresAt is passed
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1 });

export const Otp = model<IOtpDoc>('Otp', otpSchema);
