import { Series } from '../models/Series';
import { Brand } from '../models/Brand';
import { generateSlug } from '../utils/slugify';

export class SeriesService {
  static async getAll(query: Record<string, unknown> = {}) {
    const filter: Record<string, unknown> = {};
    if (query.brandId) filter.brandId = query.brandId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    return Series.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const series = await Series.findById(id);
    if (!series) throw Object.assign(new Error('Series not found'), { statusCode: 404 });
    return series;
  }

  static async create(data: { brandId: string; name: string; slug?: string; isActive?: boolean }) {
    const brand = await Brand.findById(data.brandId);
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 400 });
    const slug = data.slug || generateSlug(data.name);
    return Series.create({ ...data, slug, brandName: brand.name });
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name as string);
    const series = await Series.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!series) throw Object.assign(new Error('Series not found'), { statusCode: 404 });
    return series;
  }

  static async delete(id: string) {
    const series = await Series.findByIdAndDelete(id);
    if (!series) throw Object.assign(new Error('Series not found'), { statusCode: 404 });
  }
}
