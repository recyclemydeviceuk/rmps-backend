import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IAdminUserDoc extends Document {
  name:            string;
  email:           string;
  passwordHash:    string;
  isActive:        boolean;
  comparePassword(plain: string): Promise<boolean>;
}

const adminUserSchema = new Schema<IAdminUserDoc>(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Hash password before save
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

adminUserSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Never expose password
adminUserSchema.set('toJSON', {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => { delete ret.passwordHash; return ret; },
});

export const AdminUser = model<IAdminUserDoc>('AdminUser', adminUserSchema);
