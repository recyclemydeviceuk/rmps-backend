import { Router } from 'express';
import { trackRepair } from '../controllers/track.controller';

const router = Router();

// GET /api/track/:orderNumber
router.get('/:orderNumber', trackRepair);

export default router;
