import { RepairType } from '../models/RepairType';
import { PricingRule } from '../models/PricingRule';
import { generateSlug } from '../utils/slugify';

export class RepairTypesService {
  static async getAll(filter: Record<string, unknown> = {}) {
    return RepairType.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const type = await RepairType.findById(id).lean();
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });

    // If the repair type has no warranty set yet (legacy data), fall back to
    // the warranty stored on one of its pricing rules so the admin panel
    // stays in sync with what the website already shows.
    if (!type.warranty) {
      const rule = await PricingRule.findOne({ repairTypeId: id, warranty: { $exists: true, $ne: '' } })
        .select('warranty')
        .lean();
      if (rule?.warranty) {
        (type as any).warranty = rule.warranty;
      }
    }

    return type;
  }

  static async create(data: { name: string; slug?: string; category: string; description?: string; warranty?: string; imageUrl?: string; isActive?: boolean }) {
    const slug = data.slug || generateSlug(data.name);
    return RepairType.create({ ...data, slug });
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name as string);
    const type = await RepairType.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });

    // Cascade description + warranty to all linked pricing rules so the website
    // always reflects the repair type's master values.
    const cascade: Record<string, unknown> = {};
    if (data.description !== undefined) cascade.description = data.description;
    if (data.warranty    !== undefined) cascade.warranty    = data.warranty;
    if (data.name        !== undefined) cascade.repairTypeName = data.name;

    if (Object.keys(cascade).length > 0) {
      await PricingRule.updateMany({ repairTypeId: id }, { $set: cascade });
    }

    return type;
  }

  static async delete(id: string) {
    const type = await RepairType.findByIdAndDelete(id);
    if (!type) throw Object.assign(new Error('Repair type not found'), { statusCode: 404 });
  }
}
