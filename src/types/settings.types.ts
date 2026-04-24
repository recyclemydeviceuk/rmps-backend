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
  maintenanceMode:     boolean;
  maintenanceMessage?: string;
}

export interface NotificationSettings {
  emailOnNewOrder:      boolean;
  emailOnOrderComplete: boolean;
  emailOnWarrantyClaim: boolean;
  emailOnContactForm:   boolean;
  emailOnNewsletter:    boolean;
}

export interface ISettings {
  general:       GeneralSettings;
  operations:    OperationsSettings;
  notifications: NotificationSettings;
}
