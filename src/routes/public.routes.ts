import { Router } from 'express';
import {
  getPublicDeviceTypes,
  getPublicBrands,
  getPublicBrandBySlug,
  getPublicModels,
  getPublicModelBySlug,
  getPublicRepairTypes,
  getPublicPricingByModel,
  getPublicPricing,
  getPublicAddons,
  searchCatalog,
  validatePromoCode,
  getPublicBrandSeries,
  getPublicBrandModels,
  getPublicModelBundle,
  getPublicBrandsWithMeta,
} from '../controllers/public.controller';

const router = Router();

// Catalog browsing for the customer-facing frontend
router.get('/device-types',                             getPublicDeviceTypes);
router.get('/brands',                                   getPublicBrands);
router.get('/brands-with-meta',                         getPublicBrandsWithMeta); // ⚡ fast — includes hasSeries per brand
router.get('/brands/:slug',                             getPublicBrandBySlug);
router.get('/models',                                   getPublicModels);
router.get('/models/:slug',                             getPublicModelBySlug);
router.get('/models/:slug/bundle',                      getPublicModelBundle);    // ⚡ fast — model + brand + pricing in 1 call
router.get('/repair-types',                             getPublicRepairTypes);
router.get('/pricing/model/:modelId',                   getPublicPricingByModel);
router.get('/pricing/:modelId/:repairTypeId',           getPublicPricing);
router.get('/addons',                                   getPublicAddons);
router.get('/search',                                   searchCatalog);
router.post('/promo-codes/validate',                    validatePromoCode);
router.get('/brands/:slug/series',                      getPublicBrandSeries);
router.get('/brands/:slug/models',                      getPublicBrandModels);    // ⚡ now paginated + searchable

export default router;
