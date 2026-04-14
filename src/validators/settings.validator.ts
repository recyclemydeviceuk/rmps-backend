import { z } from 'zod';

export const generalSettingsSchema = z.object({
  businessName:   z.string().min(1),
  tagline:        z.string().optional(),
  phone:          z.string().optional(),
  email:          z.string().email().optional().or(z.literal('')),
  address:        z.string().optional(),
  whatsappNumber: z.string().optional(),
  logoUrl:        z.string().url().optional().or(z.literal('')),
});

export const operationsSettingsSchema = z.object({
  openingHours:        z.string().optional(),
  closingHours:        z.string().optional(),
  maintenanceMode:     z.boolean().optional(),
  maintenanceMessage:  z.string().optional(),
  turnaroundTime:      z.string().optional(),
  maxBookingsPerDay:   z.number().int().positive().optional(),
});

export const notificationsSettingsSchema = z.object({
  emailOnNewOrder:      z.boolean().optional(),
  emailOnOrderComplete: z.boolean().optional(),
  emailOnWarrantyClaim: z.boolean().optional(),
  emailOnContactForm:   z.boolean().optional(),
  emailOnNewsletter:    z.boolean().optional(),
  adminNotifyEmail:     z.string().email().optional().or(z.literal('')),
});
