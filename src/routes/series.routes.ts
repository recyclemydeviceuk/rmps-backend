import { Router } from 'express';
import {
  getAllSeries, getSeries,
  createSeries, updateSeries, deleteSeries,
} from '../controllers/series.controller';
import { validateBody } from '../middleware/validate';
import { createSeriesSchema } from '../validators/catalog.validator';

const router = Router();

router.get('/',    getAllSeries);
router.get('/:id', getSeries);
router.post('/',   validateBody(createSeriesSchema), createSeries);
router.put('/:id', validateBody(createSeriesSchema.partial()), updateSeries);
router.delete('/:id', deleteSeries);

export default router;
