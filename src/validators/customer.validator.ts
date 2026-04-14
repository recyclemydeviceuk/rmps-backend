import { z } from 'zod';

const CUSTOMER_STATUSES = ['active', 'inactive', 'banned'] as const;

export const updateCustomerSchema = z.object({
  name:    z.string().min(1).optional(),
  phone:   z.string().optional(),
  status:  z.enum(CUSTOMER_STATUSES).optional(),
  address: z.object({
    street:   z.string().optional(),
    city:     z.string().optional(),
    postcode: z.string().optional(),
    country:  z.string().optional(),
  }).optional(),
});
