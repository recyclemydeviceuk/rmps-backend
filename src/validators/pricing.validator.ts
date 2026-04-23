import { z } from 'zod';

export const createPricingRuleSchema = z.object({
  modelId:       z.string().min(1, 'Model is required'),
  repairTypeId:  z.string().min(1, 'Repair type is required'),
  price:         z.number().min(0, 'Price must be positive'),
  isActive:      z.boolean().optional().default(true),
});
