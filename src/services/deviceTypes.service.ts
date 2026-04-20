import { DeviceType } from '../models/DeviceType';
import { Brand } from '../models/Brand';
import { DeviceModel } from '../models/DeviceModel';
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

  static async create(data: { name: string; slug?: string; subtitle?: string; imageUrl?: string; isActive?: boolean }) {
    const slug = data.slug || generateSlug(data.name);
    return DeviceType.create({ ...data, slug });
  }

  static async update(id: string, data: Partial<{ name: string; slug: string; subtitle: string; imageUrl: string; isActive: boolean }>) {
    // Slug is IMMUTABLE after creation — changing it would break:
    //   • Customer-facing URLs (/book-repair/:slug)
    //   • VALID_TABS routing guards in the app
    //   • Brand.deviceTypeName denormalised references
    // Admin can freely edit name / image / active flag — but slug stays.
    const { slug: _ignored, ...safeData } = data;
    const item = await DeviceType.findByIdAndUpdate(id, safeData, { new: true, runValidators: true });
    if (!item) throw Object.assign(new Error('Device type not found'), { statusCode: 404 });

    // Cascade name changes to denormalised `deviceTypeName` on brands + models
    if (typeof safeData.name === 'string') {
      await Brand.updateMany({ deviceTypeId: item._id }, { $set: { deviceTypeName: item.name } });
      await DeviceModel.updateMany({ deviceTypeId: item._id }, { $set: { deviceTypeName: item.name } });
    }

    return item;
  }

  static async delete(id: string) {
    const item = await DeviceType.findByIdAndDelete(id);
    if (!item) throw Object.assign(new Error('Device type not found'), { statusCode: 404 });
  }
}
