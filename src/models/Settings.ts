import { Schema, model, Document } from 'mongoose';

export interface ISettingsDoc extends Document {
  general: {
    businessName:    string;
    tagline?:        string;
    phone:           string;
    email:           string;
    address:         string;
    whatsappNumber?: string;
    logoUrl?:        string;
  };
  operations: {
    openingHours:        string;
    closingHours:        string;
    maintenanceMode:     boolean;
    maintenanceMessage?: string;
    turnaroundTime:      string;
    maxBookingsPerDay?:  number;
  };
  notifications: {
    emailOnNewOrder:      boolean;
    emailOnOrderComplete: boolean;
    emailOnWarrantyClaim: boolean;
    emailOnContactForm:   boolean;
    emailOnNewsletter:    boolean;
    adminNotifyEmail:     string;
  };
}

const schema = new Schema<ISettingsDoc>(
  {
    general: {
      businessName:    { type: String, default: 'RepairMyPhoneScreen' },
      tagline:         { type: String },
      phone:           { type: String, default: '' },
      email:           { type: String, default: '' },
      address:         { type: String, default: '' },
      whatsappNumber:  { type: String },
      logoUrl:         { type: String },
    },
    operations: {
      openingHours:        { type: String, default: '09:00' },
      closingHours:        { type: String, default: '18:00' },
      maintenanceMode:     { type: Boolean, default: false },
      maintenanceMessage:  { type: String },
      turnaroundTime:      { type: String, default: '1-2 hours' },
      maxBookingsPerDay:   { type: Number },
    },
    notifications: {
      emailOnNewOrder:      { type: Boolean, default: true },
      emailOnOrderComplete: { type: Boolean, default: true },
      emailOnWarrantyClaim: { type: Boolean, default: true },
      emailOnContactForm:   { type: Boolean, default: true },
      emailOnNewsletter:    { type: Boolean, default: false },
      adminNotifyEmail:     { type: String, default: '' },
    },
  },
  { timestamps: true },
);

// Singleton — only one settings document
export const Settings = model<ISettingsDoc>('Settings', schema);
