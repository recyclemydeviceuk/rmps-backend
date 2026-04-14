import { RepairType } from '../models/RepairType';
import { generateSlug } from '../utils/slugify';

export class RepairTypesService {
  static async getAll(filter: Record<string, unknown> = {}) {
    return RepairType.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const type = await RepairType.findById(id);
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });
    return type;
  }

  static async create(data: { name: string; slug?: string; category: string; description?: string; isActive?: boolean }) {
    const slug = data.slug || generateSlug(data.name);
    return RepairType.create({ ...data, slug });
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name as string);
    const type = await RepairType.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });
    return type;
  }

  static async delete(id: string) {
    const type = await RepairType.findByIdAndDelete(id);
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });
  }
}
