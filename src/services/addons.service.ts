import { Addon } from '../models/Addon';

export class AddonsService {
  static async getAll(query: Record<string, unknown> = {}) {
    const filter: Record<string, unknown> = {};
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    if (query.category) filter.category = query.category;
    return Addon.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  }

  static async getById(id: string) {
    const addon = await Addon.findById(id);
    if (!addon) throw Object.assign(new Error('Add-on not found'), { statusCode: 404 });
    return addon;
  }

  static async create(data: Record<string, unknown>) {
    return Addon.create(data);
  }

  static async update(id: string, data: Record<string, unknown>) {
    const addon = await Addon.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!addon) throw Object.assign(new Error('Add-on not found'), { statusCode: 404 });
    return addon;
  }

  static async delete(id: string) {
    const addon = await Addon.findByIdAndDelete(id);
    if (!addon) throw Object.assign(new Error('Add-on not found'), { statusCode: 404 });
  }

  static async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      Addon.findByIdAndUpdate(id, { sortOrder: index }),
    );
    await Promise.all(updates);
  }
}
