import { Router } from 'express';
import {
  getPricing, getPricingRule,
  createPricingRule, updatePricingRule, deletePricingRule,
  getPricingByModel,
} from '../controllers/pricing.controller';
import { validateBody } from '../middleware/validate';
import { createPricingRuleSchema } from '../validators/pricing.validator';

const router = Router();

router.get('/',              getPricing);
router.get('/model/:modelId', getPricingByModel);
router.get('/:id',           getPricingRule);
router.post('/',             validateBody(createPricingRuleSchema), createPricingRule);
router.put('/:id',           validateBody(createPricingRuleSchema.partial()), updatePricingRule);
router.delete('/:id',        deletePricingRule);

export default router;
