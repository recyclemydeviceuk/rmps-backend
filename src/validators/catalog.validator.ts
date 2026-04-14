import { z } from 'zod';

export const createDeviceTypeSchema = z.object({
  name:      z.string().min(1, 'Name is required').max(100),
  slug:      z.string().optional(),
  imageUrl:  z.string().url().optional().or(z.literal('')),
  isActive:  z.boolean().optional().default(true),
});

export const createBrandSchema = z.object({
  deviceTypeId:     z.string().min(1, 'Device type is required'),
  name:             z.string().min(1, 'Name is required').max(100),
  slug:             z.string().optional(),
  logoUrl:          z.string().url().optional().or(z.literal('')),
  showcaseImageUrl: z.string().url().optional().or(z.literal('')),
  isActive:         z.boolean().optional().default(true),
});

export const createSeriesSchema = z.object({
  brandId:  z.string().min(1, 'Brand is required'),
  name:     z.string().min(1, 'Name is required').max(100),
  slug:     z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const createModelSchema = z.object({
  deviceTypeId: z.string().min(1, 'Device type is required'),
  brandId:      z.string().min(1, 'Brand is required'),
  seriesId:     z.string().optional(),
  name:         z.string().min(1, 'Name is required').max(100),
  slug:         z.string().optional(),
  imageUrl:     z.string().url().optional().or(z.literal('')),
  releaseYear:  z.number().int().min(2000).max(2100).optional(),
  isActive:     z.boolean().optional().default(true),
});
