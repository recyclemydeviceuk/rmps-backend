import { PricingRule } from '../models/PricingRule';
import { DeviceModel } from '../models/DeviceModel';
import { RepairType } from '../models/RepairType';

export class PricingService {
  static async getAll(query: Record<string, unknown> = {}) {
    const filter: Record<string, unknown> = {};
    if (query.modelId) filter.modelId = query.modelId;
    if (query.isActive !== undefined) filter.isActive = query.isActive;
    return PricingRule.find(filter).sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    const rule = await PricingRule.findById(id);
    if (!rule) throw Object.assign(new Error('Pricing rule not found'), { statusCode: 404 });
    return rule;
  }

  static async getByModel(modelId: string) {
    const rules = await PricingRule.find({ modelId, isActive: true }).lean();
    if (rules.length === 0) return rules;

    // Enrich each rule with the repair type's imageUrl
    const repairTypeIds = [...new Set(rules.map(r => r.repairTypeId.toString()))];
    const repairTypes   = await RepairType.find({ _id: { $in: repairTypeIds } }, { imageUrl: 1 }).lean();
    const imageMap      = new Map(repairTypes.map(rt => [rt._id.toString(), rt.imageUrl ?? '']));

    return rules.map(r => ({ ...r, repairTypeImageUrl: imageMap.get(r.repairTypeId.toString()) ?? '' }));
  }

  static async getByModelAndRepair(modelId: string, repairTypeId: string) {
    const rule = await PricingRule.findOne({ modelId, repairTypeId, isActive: true });
    if (!rule) throw Object.assign(new Error('Pricing not found'), { statusCode: 404 });
    return rule;
  }

  static async create(data: { modelId: string; repairTypeId: string; price: number; originalPrice?: number; isActive?: boolean }) {
    const [model, repairType] = await Promise.all([
      DeviceModel.findById(data.modelId),
      RepairType.findById(data.repairTypeId),
    ]);
    if (!model) throw Object.assign(new Error('Model not found'), { statusCode: 400 });
    if (!repairType) throw Object.assign(new Error('Repair type not found'), { statusCode: 400 });

    const rule = await PricingRule.create({
      ...data,
      modelName:      model.name,
      brandName:      model.brandName,
      repairTypeName: repairType.name,
      category:       repairType.category,
    });

    await DeviceModel.findByIdAndUpdate(data.modelId, { $inc: { repairCount: 1 } });
    return rule;
  }

  static async update(id: string, data: Record<string, unknown>) {
    const rule = await PricingRule.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!rule) throw Object.assign(new Error('Pricing rule not found'), { statusCode: 404 });
    return rule;
  }

  static async delete(id: string) {
    const rule = await PricingRule.findByIdAndDelete(id);
    if (!rule) throw Object.assign(new Error('Pricing rule not found'), { statusCode: 404 });
    await DeviceModel.findByIdAndUpdate(rule.modelId, { $inc: { repairCount: -1 } });
  }
}
