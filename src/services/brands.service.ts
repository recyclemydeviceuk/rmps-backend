import { Brand } from '../models/Brand';
import { DeviceType } from '../models/DeviceType';
import { generateSlug } from '../utils/slugify';

export class BrandsService {
  static async getAll(query: Record<string, unknown> = {}) {
    const filter: Record<string, unknown> = {};
    if (query.deviceTypeId) filter.deviceTypeId = query.deviceTypeId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    return Brand.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const brand = await Brand.findById(id);
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 404 });
    return brand;
  }

  static async getBySlug(slug: string) {
    const brand = await Brand.findOne({ slug });
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 404 });
    return brand;
  }

  static async create(data: { deviceTypeId: string; name: string; slug?: string; logoUrl?: string; showcaseImageUrl?: string; isActive?: boolean }) {
    const deviceType = await DeviceType.findById(data.deviceTypeId);
    if (!deviceType) throw Object.assign(new Error('Device type not found'), { statusCode: 400 });
    const slug = data.slug || generateSlug(data.name);
    const brand = await Brand.create({ ...data, slug, deviceTypeName: deviceType.name });
    // Increment brand count on device type
    await DeviceType.findByIdAndUpdate(data.deviceTypeId, { $inc: { brandCount: 1 } });
    return brand;
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name as string);
    const brand = await Brand.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 404 });
    return brand;
  }

  static async delete(id: string) {
    const brand = await Brand.findByIdAndDelete(id);
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 404 });
    await DeviceType.findByIdAndUpdate(brand.deviceTypeId, { $inc: { brandCount: -1 } });
  }
}
