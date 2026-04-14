import { BlogPost } from '../models/BlogPost';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { generateSlug } from '../utils/slugify';

export class BlogService {
  /** Admin: get all posts (drafts + published), paginated & filterable */
  static async getAll(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};

    if (query.category) filter.category = query.category;
    if (query.status === 'published') filter.isPublished = true;
    if (query.status === 'draft') filter.isPublished = false;
    if (query.search) {
      const q = new RegExp(query.search as string, 'i');
      filter.$or = [{ title: q }, { excerpt: q }, { tags: q }];
    }

    const [data, total] = await Promise.all([
      BlogPost.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(limit),
      BlogPost.countDocuments(filter),
    ]);

    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  /** Public: get only published posts, paginated & filterable */
  static async getPublished(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = { isPublished: true };

    if (query.category) filter.category = query.category;
    if (query.search) {
      const q = new RegExp(query.search as string, 'i');
      filter.$or = [{ title: q }, { excerpt: q }, { tags: q }];
    }

    const [data, total] = await Promise.all([
      BlogPost.find(filter)
        .select('-content')
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit),
      BlogPost.countDocuments(filter),
    ]);

    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  /** Public: get a single published post by slug, increment views */
  static async getBySlug(slug: string) {
    const post = await BlogPost.findOneAndUpdate(
      { slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 });
    return post;
  }

  /** Admin: get a single post by ID (no view increment) */
  static async getById(id: string) {
    const post = await BlogPost.findById(id);
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 });
    return post;
  }

  /** Admin: create a new blog post */
  static async create(data: Record<string, unknown>) {
    if (!data.slug) {
      data.slug = generateSlug(data.title as string);
    }
    if (data.isPublished && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    return BlogPost.create(data);
  }

  /** Admin: update an existing blog post */
  static async update(id: string, data: Record<string, unknown>) {
    // If switching from draft to published, set publishedAt
    if (data.isPublished) {
      const existing = await BlogPost.findById(id);
      if (existing && !existing.isPublished && !data.publishedAt) {
        data.publishedAt = new Date();
      }
    }

    const post = await BlogPost.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 });
    return post;
  }

  /** Admin: delete a blog post */
  static async delete(id: string) {
    const post = await BlogPost.findByIdAndDelete(id);
    if (!post) throw Object.assign(new Error('Blog post not found'), { statusCode: 404 });
    return post;
  }
}
