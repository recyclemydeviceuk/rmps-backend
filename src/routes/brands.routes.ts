import { Router } from 'express';
import {
  getBrands, getBrand,
  createBrand, updateBrand, deleteBrand,
} from '../controllers/brands.controller';
import { validateBody } from '../middleware/validate';
import { createBrandSchema } from '../validators/catalog.validator';

const router = Router();

router.get('/',    getBrands);
router.get('/:id', getBrand);
router.post('/',   validateBody(createBrandSchema), createBrand);
router.put('/:id', validateBody(createBrandSchema.partial()), updateBrand);
router.delete('/:id', deleteBrand);

export default router;
