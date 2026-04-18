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
import { PricingRule } from '../models/PricingRule';
import { RepairType } from '../models/RepairType';

// ── Simple in-process HTTP cache headers (1 hour) for the essentially-static catalog
function setCatalogCache(res: Response, seconds = 3600) {
  res.setHeader('Cache-Control', `public, max-age=${seconds}, stale-while-revalidate=86400`);
}

export const getPublicDeviceTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await DeviceTypesService.getAll({ isActive: true });
  setCatalogCache(res);
  sendSuccess(res, types, 'Device types retrieved');
});

export const getPublicBrands = asyncHandler(async (req: Request, res: Response) => {
  const brands = await BrandsService.getAll({ ...req.query, isActive: true });
  setCatalogCache(res);
  sendSuccess(res, brands, 'Brands retrieved');
});

export const getPublicBrandBySlug = asyncHandler(async (req: Request, res: Response) => {
  const brand = await BrandsService.getBySlug(req.params.slug);
  setCatalogCache(res);
  sendSuccess(res, brand, 'Brand retrieved');
});

export const getPublicModels = asyncHandler(async (req: Request, res: Response) => {
  const models = await ModelsService.getAll({ ...req.query, isActive: true });
  setCatalogCache(res);
  sendSuccess(res, models, 'Models retrieved');
});

export const getPublicModelBySlug = asyncHandler(async (req: Request, res: Response) => {
  const model = await ModelsService.getBySlug(req.params.slug);
  setCatalogCache(res);
  sendSuccess(res, model, 'Model retrieved');
});

export const getPublicRepairTypes = asyncHandler(async (_req: Request, res: Response) => {
  const types = await RepairTypesService.getAll({ isActive: true });
  setCatalogCache(res);
  sendSuccess(res, types, 'Repair types retrieved');
});

export const getPublicPricingByModel = asyncHandler(async (req: Request, res: Response) => {
  const rules = await PricingService.getByModel(req.params.modelId);
  setCatalogCache(res, 600); // pricing cached 10 min (could change more often than brands)
  sendSuccess(res, rules, 'Model pricing retrieved');
});

export const getPublicPricing = asyncHandler(async (req: Request, res: Response) => {
  const rule = await PricingService.getByModelAndRepair(req.params.modelId, req.params.repairTypeId);
  setCatalogCache(res, 600);
  sendSuccess(res, rule, 'Pricing retrieved');
});

export const getPublicAddons = asyncHandler(async (_req: Request, res: Response) => {
  const addons = await AddonsService.getAll({ isActive: true });
  setCatalogCache(res);
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
  const series = await Series.find({ brandId: brand._id, isActive: true })
    .select('_id brandId brandName name slug modelCount isActive')
    .sort({ name: 1 })
    .lean();
  setCatalogCache(res);
  sendSuccess(res, { brand, series }, 'Brand series retrieved');
});

/**
 * Paginated + searchable brand-models endpoint.
 *
 * Query params:
 *   - seriesSlug  (optional) — filter by a specific series
 *   - q           (optional) — case-insensitive search on model name
 *   - page        (default: 1)
 *   - limit       (default: 30, max: 100)
 */
export const getPublicBrandModels = asyncHandler(async (req: Request, res: Response) => {
  const brand = await Brand.findOne({ slug: req.params.slug, isActive: true }).lean();
  if (!brand) {
    res.status(404).json({ success: false, message: 'Brand not found' });
    return;
  }

  const filter: Record<string, unknown> = { brandId: brand._id, isActive: true };

  if (req.query.seriesSlug) {
    const series = await Series.findOne({ slug: req.query.seriesSlug as string, brandId: brand._id })
      .select('_id')
      .lean();
    if (series) filter.seriesId = series._id;
  }

  if (req.query.q && typeof req.query.q === 'string' && req.query.q.trim().length > 0) {
    const q = req.query.q.trim().slice(0, 100);
    filter.name = new RegExp(escapeRegex(q), 'i');
  }

  const page  = Math.max(1, parseInt((req.query.page as string)  || '1',  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) || '30', 10) || 30));
  const skip  = (page - 1) * limit;

  const [models, total] = await Promise.all([
    DeviceModel.find(filter)
      .select('_id name slug brandName deviceTypeName imageUrl seriesId seriesName isActive')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    DeviceModel.countDocuments(filter),
  ]);

  setCatalogCache(res);
  sendSuccess(res, {
    brand,
    models,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: skip + models.length < total,
    },
  }, 'Brand models retrieved');
});

/**
 * One-shot endpoint that returns everything BookRepairRepairPage needs
 * for a specific model — model info, brand info, and all active pricing rules
 * (with their repair type imageUrls). Replaces the old two-step flow of
 *    GET /public/models/:slug → get _id
 *    GET /public/pricing/model/:modelId
 * plus the N+1 lookup of RepairType.imageUrl inside PricingService.
 */
export const getPublicModelBundle = asyncHandler(async (req: Request, res: Response) => {
  const modelSlug = req.params.slug;

  // Single aggregation pipeline: model + brand + all active pricing rules
  // + repair type imageUrls, all in one round trip.
  const pipeline: any[] = [
    { $match: { slug: modelSlug, isActive: true } },
    { $limit: 1 },
    {
      $lookup: {
        from: 'brands',
        localField: 'brandId',
        foreignField: '_id',
        as: 'brand',
      },
    },
    { $unwind: { path: '$brand', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'pricingrules',
        let: { modelId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: { $and: [
                { $eq: ['$modelId', '$$modelId'] },
                { $eq: ['$isActive', true] },
              ]},
            },
          },
          {
            $lookup: {
              from: 'repairtypes',
              localField: 'repairTypeId',
              foreignField: '_id',
              as: 'repairType',
            },
          },
          { $unwind: { path: '$repairType', preserveNullAndEmptyArrays: true } },
          {
            $addFields: {
              repairTypeImageUrl: { $ifNull: ['$repairType.imageUrl', ''] },
            },
          },
          { $project: { repairType: 0 } },
        ],
        as: 'pricing',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        brandName: 1,
        deviceTypeName: 1,
        imageUrl: 1,
        seriesId: 1,
        seriesName: 1,
        isActive: 1,
        brand: 1,
        pricing: 1,
      },
    },
  ];

  const [result] = await DeviceModel.aggregate(pipeline);
  if (!result) {
    res.status(404).json({ success: false, message: 'Model not found' });
    return;
  }

  // Simple cache — pricing doesn't change often
  setCatalogCache(res, 600);
  sendSuccess(res, result, 'Model bundle retrieved');
});

/**
 * Returns a lightweight summary of all brands for a given device type,
 * including `hasSeries` so the frontend can route directly to models vs series
 * without needing to make N additional requests to /public/brands/:slug/series.
 */
export const getPublicBrandsWithMeta = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.deviceTypeId) filter.deviceTypeId = req.query.deviceTypeId;

  const brands = await Brand.find(filter)
    .select('_id deviceTypeId deviceTypeName name slug logoUrl showcaseImageUrl modelCount hasSeries isActive')
    .sort({ name: 1 })
    .lean();

  // Defensive: if any brand doesn't have hasSeries persisted yet, compute it on-the-fly
  const missing = brands.filter(b => typeof (b as any).hasSeries !== 'boolean').map(b => b._id);
  if (missing.length > 0) {
    const seriesCounts = await Series.aggregate([
      { $match: { brandId: { $in: missing }, isActive: true } },
      { $group: { _id: '$brandId', count: { $sum: 1 } } },
    ]);
    const hasMap = new Map(seriesCounts.map(s => [s._id.toString(), s.count > 0]));
    brands.forEach(b => {
      if (typeof (b as any).hasSeries !== 'boolean') {
        (b as any).hasSeries = hasMap.get(b._id.toString()) ?? false;
      }
    });
  }

  setCatalogCache(res);
  sendSuccess(res, brands, 'Brands retrieved with meta');
});

// Re-exports used by existing RepairType endpoints
export { RepairType, PricingRule };
