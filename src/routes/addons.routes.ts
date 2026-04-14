import { Router } from 'express';
import {
  getAddons, getAddon,
  createAddon, updateAddon, deleteAddon, reorderAddons,
} from '../controllers/addons.controller';
import { validateBody } from '../middleware/validate';
import { createAddonSchema } from '../validators/addon.validator';

const router = Router();

router.get('/',         getAddons);
router.get('/:id',      getAddon);
router.post('/',        validateBody(createAddonSchema), createAddon);
router.put('/:id',      validateBody(createAddonSchema.partial()), updateAddon);
router.delete('/:id',   deleteAddon);
router.post('/reorder', reorderAddons);

export default router;
