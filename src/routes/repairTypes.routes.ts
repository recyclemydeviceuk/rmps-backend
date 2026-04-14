import { Router } from 'express';
import {
  getRepairTypes, getRepairType,
  createRepairType, updateRepairType, deleteRepairType,
} from '../controllers/repairTypes.controller';
import { validateBody } from '../middleware/validate';
import { createRepairTypeSchema } from '../validators/repair.validator';

const router = Router();

router.get('/',    getRepairTypes);
router.get('/:id', getRepairType);
router.post('/',   validateBody(createRepairTypeSchema), createRepairType);
router.put('/:id', validateBody(createRepairTypeSchema.partial()), updateRepairType);
router.delete('/:id', deleteRepairType);

export default router;
