import { z } from 'zod';

const BLOG_CATEGORIES = ['general', 'iphone', 'samsung', 'ipad', 'huawei', 'sony-xperia', 'google-pixel', 'tips', 'guides'] as const;

export const createBlogSchema = z.object({
  title:       z.string().min(1, 'Title is required').max(200),
  slug:        z.string().optional(),
  excerpt:     z.string().min(1, 'Excerpt is required').max(500),
  content:     z.string().min(1, 'Content is required'),
  category:    z.enum(BLOG_CATEGORIES).optional().default('general'),
  tags:        z.array(z.string()).optional().default([]),
  imageUrl:    z.string().url().optional().or(z.literal('')),
  author:      z.string().optional(),
  isPublished: z.boolean().optional().default(false),
});
