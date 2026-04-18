import { z } from 'zod';

const ADDON_CATEGORIES = ['protection', 'warranty', 'delivery', 'accessory', 'other'] as const;

const colorOptionSchema = z.object({
  name:     z.string().min(1, 'Color name is required').max(50),
  hex:      z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'Must be a valid hex colour, e.g. #1e3a8a').max(9),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const createAddonSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required'),
  category:    z.enum(ADDON_CATEGORIES),
  price:       z.number().min(0, 'Price must be positive'),
  isActive:    z.boolean().optional().default(true),
  isRequired:  z.boolean().optional().default(false),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  sortOrder:   z.number().int().optional().default(0),
  colors:      z.array(colorOptionSchema).max(24).optional().default([]),
});
