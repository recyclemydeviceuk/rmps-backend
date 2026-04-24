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
    maintenanceMode:      boolean;
    maintenanceMessage?:  string;
  };
  notifications: {
    emailOnNewOrder:      boolean;
    emailOnOrderComplete: boolean;
    emailOnWarrantyClaim: boolean;
    emailOnContactForm:   boolean;
    emailOnNewsletter:    boolean;
  };
}

const schema = new Schema<ISettingsDoc>(
  {
    general: {
      businessName:   { type: String, default: 'RepairMyPhoneScreen' },
      tagline:        { type: String },
      phone:          { type: String, default: '' },
      email:          { type: String, default: '' },
      address:        { type: String, default: '' },
      whatsappNumber: { type: String },
      logoUrl:        { type: String },
    },
    operations: {
      maintenanceMode:    { type: Boolean, default: false },
      maintenanceMessage: { type: String },
    },
    notifications: {
      emailOnNewOrder:      { type: Boolean, default: true  },
      emailOnOrderComplete: { type: Boolean, default: true  },
      emailOnWarrantyClaim: { type: Boolean, default: true  },
      emailOnContactForm:   { type: Boolean, default: true  },
      emailOnNewsletter:    { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

// Singleton — only one settings document
export const Settings = model<ISettingsDoc>('Settings', schema);
