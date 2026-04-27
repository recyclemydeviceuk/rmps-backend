import { Schema, model, Document } from 'mongoose';

export interface IAdminUserDoc extends Document {
  name:     string;
  email:    string;
  isActive: boolean;
}

const adminUserSchema = new Schema<IAdminUserDoc>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const AdminUser = model<IAdminUserDoc>('AdminUser', adminUserSchema);
