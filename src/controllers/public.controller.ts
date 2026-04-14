import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { sendSuccess } from '../utils/apiResponse';
import { DeviceTypesService } from '../services/deviceTypes.service';
import { BrandsService } from '../services/brands.service';
import { ModelsService } from '../services/models.service';
import { RepairTypesService } from '../services/repairTypes.service';
import { PricingService } from '../services/pricing.service';
import { AddonsService } from '../services/addons.service';
import { DeviceModel } from '../models/DeviceModel';
import { PromoCode } from '../models/PromoCode';
import { Series } from '../models/Series';
import { Brand } from '../models/Brand';

export const getPublicDeviceTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await DeviceTypesService.getAll({ isActive: true });
  sendSuccess(res, types, 'Device types retrieved');
});

export const getPublicBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await BrandsService.getAll({ ...req.query, isActive: true });
  sendSuccess(res, brands, 'Brands retrieved');
});

export const getPublicBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
  const brand = await BrandsService.getBySlug(req.params.slug);
  sendSuccess(res, brand, 'Brand retrieved');
});

export const getPublicModels = asyncHandler(async (req: Request, res: Response) => {
  const models = await ModelsService.getAll({ ...req.query, isActive: true });
  sendSuccess(res, models, 'Models retrieved');
});

export const getPublicModelBySlug = asyncHandler(async (req: Request, res: Response) => {
  const model = await ModelsService.getBySlug(req.params.slug);
  sendSuccess(res, model, 'Model retrieved');
});

export const getPublicRepairTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await RepairTypesService.getAll({ isActive: true });
  sendSuccess(res, types, 'Repair types retrieved');
});

export const getPublicPricingByModel = asyncHandler(async (req: Request, res: Response) => {
  const rules = await PricingService.getByModel(req.params.modelId);
  sendSuccess(res, rules, 'Model pricing retrieved');
});

export const getPublicPricing = asyncHandler(async (req: Request, res: Response) => {
  const rule = await PricingService.getByModelAndRepair(req.params.modelId, req.params.repairTypeId);
  sendSuccess(res, rule, 'Pricing retrieved');
});

export const getPublicAddons = asyncHandler(async (_req: Request, res: Response) => {
  const addons = await AddonsService.getAll({ isActive: true });
  sendSuccess(res, addons, 'Add-ons retrieved');
});

/** Escape all regex special characters so user input can never cause ReDoS */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const searchCatalog = asyncHandler(async (req: Request, res: Response) => {
  const raw   = (req.query.q as string || '').trim();
  const query = raw.slice(0, 100); // hard cap — no one needs a 100-char model name
  if (query.length < 2) {
    sendSuccess(res, [], 'Query too short');
    return;
  }
  const regex = new RegExp(escapeRegex(query), 'i');
  const models = await DeviceModel.find({
    $or: [{ name: regex }, { brandName: regex }],
    isActive: true,
  })
    .select('name slug brandName brandId imageUrl deviceTypeName')
    .limit(20)
    .lean();

  // Build search results with links
  const results = models.map((m: any) => ({
    name: m.name,
    brandName: m.brandName,
    slug: m.slug,
    tab: m.deviceTypeName?.toLowerCase() || 'phone',
    image: m.imageUrl || '',
  }));

  sendSuccess(res, results, 'Search results');
});

export const validatePromoCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ success: false, message: 'Promo code is required' });
    return;
  }
  const promo = await PromoCode.findOne({
    code: code.toUpperCase().trim(),
    isActive: true,
  });
  if (!promo) {
    res.status(404).json({ success: false, message: 'Invalid promo code' });
    return;
  }
  if (promo.expiresAt && promo.expiresAt < new Date()) {
    res.status(400).json({ success: false, message: 'Promo code has expired' });
    return;
  }
  if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
    res.status(400).json({ success: false, message: 'Promo code usage limit reached' });
    return;
  }
  sendSuccess(res, { code: promo.code, discount: promo.discount, label: promo.label }, 'Promo code valid');
});

export const getPublicBrandSeries = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) {
    res.status(404).json({ success: false, message: 'Brand not found' });
    return;
  }
  const series = await Series.find({ brandId: brand._id, isActive: true }).sort({ name: 1 }).lean();
  sendSuccess(res, { brand, series }, 'Brand series retrieved');
});

export const getPublicBrandModels = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) {
    res.status(404).json({ success: false, message: 'Brand not found' });
    return;
  }
  const filter: Record<string, unknown> = { brandId: brand._id, isActive: true };
  if (req.query.seriesSlug) {
    const series = await Series.findOne({ slug: req.query.seriesSlug as string, brandId: brand._id }).lean();
    if (series) filter.seriesId = series._id;
  }
  const models = await DeviceModel.find(filter).sort({ name: 1 }).lean();
  sendSuccess(res, { brand, models }, 'Brand models retrieved');
});
