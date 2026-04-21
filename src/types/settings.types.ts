export interface GeneralSettings {
  businessName:    string;
  tagline?:        string;
  phone:           string;
  email:           string;
  address:         string;
  whatsappNumber?: string;
  logoUrl?:        string;
}

export interface BusinessHour {
  day:  string;
  open: boolean;
  from: string;
  to:   string;
}

export interface OperationsSettings {
  maintenanceMode:     boolean;
  maintenanceMessage?: string;
  collectionDelivery:  boolean;
  turnaroundTime:      string;
  businessHours:       BusinessHour[];
}

export interface NotificationSettings {
  emailOnNewOrder:      boolean;
  emailOnOrderComplete: boolean;
  emailOnWarrantyClaim: boolean;
  emailOnContactForm:   boolean;
  emailOnNewsletter:    boolean;
  adminNotifyEmail:     string;
}

export interface ISettings {
  general:       GeneralSettings;
  operations:    OperationsSettings;
  notifications: NotificationSettings;
}
