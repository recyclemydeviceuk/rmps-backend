export interface GeneralSettings {
  businessName:    string;
  tagline?:        string;
  phone:           string;
  email:           string;
  address:         string;
  whatsappNumber?: string;
  logoUrl?:        string;
}

export interface OperationsSettings {
  openingHours:        string;
  closingHours:        string;
  maintenanceMode:     boolean;
  maintenanceMessage?: string;
  turnaroundTime:      string;
  maxBookingsPerDay?:  number;
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
