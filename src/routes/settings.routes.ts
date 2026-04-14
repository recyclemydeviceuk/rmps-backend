import { Router } from 'express';
import {
  getSettings,
  updateGeneralSettings,
  updateOperationsSettings,
  updateNotificationsSettings,
} from '../controllers/settings.controller';
import { validateBody } from '../middleware/validate';
import {
  generalSettingsSchema,
  operationsSettingsSchema,
  notificationsSettingsSchema,
} from '../validators/settings.validator';

const router = Router();

router.get('/',                  getSettings);
router.put('/general',           validateBody(generalSettingsSchema), updateGeneralSettings);
router.put('/operations',        validateBody(operationsSettingsSchema), updateOperationsSettings);
router.put('/notifications',     validateBody(notificationsSettingsSchema), updateNotificationsSettings);

export default router;
