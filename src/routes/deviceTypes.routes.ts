import { Router } from 'express';
import {
  getDeviceTypes, getDeviceType,
  createDeviceType, updateDeviceType, deleteDeviceType,
} from '../controllers/deviceTypes.controller';
import { validateBody } from '../middleware/validate';
import { createDeviceTypeSchema } from '../validators/catalog.validator';

const router = Router();

router.get('/',    getDeviceTypes);
router.get('/:id', getDeviceType);
router.post('/',   validateBody(createDeviceTypeSchema), createDeviceType);
router.put('/:id', validateBody(createDeviceTypeSchema.partial()), updateDeviceType);
router.delete('/:id', deleteDeviceType);

export default router;
