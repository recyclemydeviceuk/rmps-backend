import { z } from 'zod';

const ADDON_CATEGORIES = ['protection', 'warranty', 'delivery', 'accessory'] as const;

export const createAddonSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  category:    z.enum(ADDON_CATEGORIES),
  price:       z.number().min(0, 'Price must be positive'),
  isActive:    z.boolean().optional().default(true),
  isRequired:  z.boolean().optional().default(false),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  sortOrder:   z.number().int().optional().default(0),
});
