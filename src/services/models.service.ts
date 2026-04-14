import { DeviceModel } from '../models/DeviceModel';
import { Brand } from '../models/Brand';
import { DeviceType } from '../models/DeviceType';
import { Series } from '../models/Series';
import { generateSlug } from '../utils/slugify';

export class ModelsService {
  static async getAll(query: Record<string, unknown> = {}) {
    const filter: Record<string, unknown> = {};
    if (query.brandId) filter.brandId = query.brandId;
    if (query.deviceTypeId) filter.deviceTypeId = query.deviceTypeId;
    if (query.seriesId) filter.seriesId = query.seriesId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    return DeviceModel.find(filter).sort({ name: 1 });
  }

  static async getById(id: string) {
    const model = await DeviceModel.findById(id);
    if (!model) throw Object.assign(new Error('Model not found'), { statusCode: 404 });
    return model;
  }

  static async getBySlug(slug: string) {
    const model = await DeviceModel.findOne({ slug });
    if (!model) throw Object.assign(new Error('Model not found'), { statusCode: 404 });
    return model;
  }

  static async create(data: Record<string, unknown>) {
    const [deviceType, brand] = await Promise.all([
      DeviceType.findById(data.deviceTypeId as string),
      Brand.findById(data.brandId as string),
    ]);
    if (!deviceType) throw Object.assign(new Error('Device type not found'), { statusCode: 400 });
    if (!brand) throw Object.assign(new Error('Brand not found'), { statusCode: 400 });

    let seriesName: string | undefined;
    if (data.seriesId) {
      const series = await Series.findById(data.seriesId as string);
      if (series) seriesName = series.name;
    }

    const slug = (data.slug as string) || generateSlug(data.name as string);
    const model = await DeviceModel.create({
      ...data, slug,
      deviceTypeName: deviceType.name,
      brandName: brand.name,
      ...(seriesName && { seriesName }),
    });

    await Brand.findByIdAndUpdate(data.brandId, { $inc: { modelCount: 1 } });
    return model;
  }

  static async update(id: string, data: Record<string, unknown>) {
    if (data.name && !data.slug) data.slug = generateSlug(data.name as string);
    const model = await DeviceModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!model) throw Object.assign(new Error('Model not found'), { statusCode: 404 });
    return model;
  }

  static async delete(id: string) {
    const model = await DeviceModel.findByIdAndDelete(id);
    if (!model) throw Object.assign(new Error('Model not found'), { statusCode: 404 });
    await Brand.findByIdAndUpdate(model.brandId, { $inc: { modelCount: -1 } });
  }
}
