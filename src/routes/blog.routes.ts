import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { createBlogSchema } from '../validators/blog.validator';
import {
  getBlogs, getBlog, createBlog, updateBlog, deleteBlog,
  getPublicBlogs, getPublicBlogBySlug,
} from '../controllers/blog.controller';

const router = Router();

// Public routes (no auth)
router.get('/public', getPublicBlogs);
router.get('/public/:slug', getPublicBlogBySlug);

// Admin routes (auth required)
router.get('/', authenticate, getBlogs);
router.get('/:id', authenticate, getBlog);
router.post('/', authenticate, validateBody(createBlogSchema), createBlog);
router.put('/:id', authenticate, validateBody(createBlogSchema.partial()), updateBlog);
router.delete('/:id', authenticate, deleteBlog);

export default router;
