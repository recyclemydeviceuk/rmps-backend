import { Schema, model, Document } from 'mongoose';

export interface IBusinessHour {
  day:   string;
  open:  boolean;
  from:  string;
  to:    string;
}

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
    acceptNewBookings:    boolean;
    sameDayRepairs:       boolean;
    collectionDelivery:   boolean;
    turnaroundTime:       string;
    businessHours:        IBusinessHour[];
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

const businessHourSchema = new Schema<IBusinessHour>(
  { day: String, open: Boolean, from: String, to: String },
  { _id: false },
);

const DEFAULT_HOURS: IBusinessHour[] = [
  { day: 'Monday',    open: true,  from: '09:00', to: '18:00' },
  { day: 'Tuesday',   open: true,  from: '09:00', to: '18:00' },
  { day: 'Wednesday', open: true,  from: '09:00', to: '18:00' },
  { day: 'Thursday',  open: true,  from: '09:00', to: '18:00' },
  { day: 'Friday',    open: true,  from: '09:00', to: '18:00' },
  { day: 'Saturday',  open: false, from: '09:00', to: '17:00' },
  { day: 'Sunday',    open: false, from: '10:00', to: '16:00' },
];

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
      acceptNewBookings:  { type: Boolean, default: true },
      sameDayRepairs:     { type: Boolean, default: true },
      collectionDelivery: { type: Boolean, default: true },
      turnaroundTime:     { type: String,  default: '1-2 hours' },
      businessHours:      { type: [businessHourSchema], default: DEFAULT_HOURS },
    },
    notifications: {
      emailOnNewOrder:      { type: Boolean, default: true  },
      emailOnOrderComplete: { type: Boolean, default: true  },
      emailOnWarrantyClaim: { type: Boolean, default: true  },
      emailOnContactForm:   { type: Boolean, default: true  },
      emailOnNewsletter:    { type: Boolean, default: false },
      adminNotifyEmail:     { type: String,  default: ''    },
    },
  },
  { timestamps: true },
);

// Singleton — only one settings document
export const Settings = model<ISettingsDoc>('Settings', schema);
