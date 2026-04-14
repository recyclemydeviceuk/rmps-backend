import { Router } from 'express';
import {
  getModels, getModel,
  createModel, updateModel, deleteModel,
} from '../controllers/models.controller';
import { validateBody } from '../middleware/validate';
import { createModelSchema } from '../validators/catalog.validator';

const router = Router();

router.get('/',    getModels);
router.get('/:id', getModel);
router.post('/',   validateBody(createModelSchema), createModel);
router.put('/:id', validateBody(createModelSchema.partial()), updateModel);
router.delete('/:id', deleteModel);

export default router;
