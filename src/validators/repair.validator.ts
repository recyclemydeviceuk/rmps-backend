import { z } from 'zod';

const REPAIR_CATEGORIES = ['screen', 'battery', 'camera', 'back_glass', 'charging_port', 'speaker', 'other'] as const;

export const createRepairTypeSchema = z.object({
  name:        z.string().min(1, 'Name is required').max(100),
  slug:        z.string().optional(),
  category:    z.enum(REPAIR_CATEGORIES),
  description: z.string().optional(),
  imageUrl:    z.string().optional(),
  isActive:    z.boolean().optional().default(true),
});
