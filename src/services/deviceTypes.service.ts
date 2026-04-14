import { DeviceType } from '../models/DeviceType';
import { generateSlug } from '../utils/slugify';

export class DeviceTypesService {
  static async getAll(filter: Record<string, unknown> = {}) {
    return DeviceType.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const item = await DeviceType.findById(id);
    if (!item) throw Object.assign(new Error('Device type not found'), { statusCode: 404 });
    return item;
  }

  static async create(data: { name: string; slug?: string; imageUrl?: string; isActive?: boolean }) {
    const slug = data.slug || generateSlug(data.name);
    return DeviceType.create({ ...data, slug });
  }

  static async update(id: string, data: Partial<{ name: string; slug: string; imageUrl: string; isActive: boolean }>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name);
    const item = await DeviceType.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!item) throw Object.assign(new Error('Device type not found'), { statusCode: 404 });
    return item;
  }

  static async delete(id: string) {
    const item = await DeviceType.findByIdAndDelete(id);
    if (!item) throw Object.assign(new Error('Device type not found'), { statusCode: 404 });
  }
}
