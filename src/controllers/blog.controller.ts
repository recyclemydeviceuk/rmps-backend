import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse';
import { BlogService } from '../services/blog.service';

// ── Admin routes ─────────────────────────────────────────────

export const getBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await BlogService.getAll(req.query);
  sendSuccess(res, result.data, 'Blog posts retrieved', 200, result.meta);
});

export const getBlog = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogService.getById(req.params.id);
  sendSuccess(res, post, 'Blog post retrieved');
});

export const createBlog = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogService.create(req.body);
  sendCreated(res, post, 'Blog post created');
});

export const updateBlog = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogService.update(req.params.id, req.body);
  sendSuccess(res, post, 'Blog post updated');
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response) => {
  await BlogService.delete(req.params.id);
  sendNoContent(res);
});

// ── Public routes ────────────────────────────────────────────

export const getPublicBlogs = asyncHandler(async (req: Request, res: Response) => {
  const result = await BlogService.getPublished(req.query);
  sendSuccess(res, result.data, 'Published blog posts retrieved', 200, result.meta);
});

export const getPublicBlogBySlug = asyncHandler(async (req: Request, res: Response) => {
  const post = await BlogService.getBySlug(req.params.slug);
  sendSuccess(res, post, 'Blog post retrieved');
});
