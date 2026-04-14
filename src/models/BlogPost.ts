import { Schema, model, Document } from 'mongoose';

const BLOG_CATEGORIES = ['general', 'iphone', 'samsung', 'ipad', 'huawei', 'sony-xperia', 'google-pixel', 'tips', 'guides'] as const;

export interface IBlogPostDoc extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;          // HTML content
  category: typeof BLOG_CATEGORIES[number];
  tags: string[];
  imageUrl?: string;
  author: string;
  isPublished: boolean;
  publishedAt?: Date;
  views: number;
}

const schema = new Schema<IBlogPostDoc>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    excerpt:     { type: String, required: true },
    content:     { type: String, required: true },
    category:    { type: String, enum: BLOG_CATEGORIES, default: 'general' },
    tags:        [{ type: String }],
    imageUrl:    { type: String },
    author:      { type: String, default: 'Repair My Phone Screen' },
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
    views:       { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const BlogPost = model<IBlogPostDoc>('BlogPost', schema);
