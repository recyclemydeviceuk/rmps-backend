import { Router } from 'express';
import {
  getSettings,
  updateGeneralSettings,
  updateOperationsSettings,
  updateNotificationsSettings,
} from '../controllers/settings.controller';
import { validateBody } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import {
  generalSettingsSchema,
  operationsSettingsSchema,
  notificationsSettingsSchema,
} from '../validators/settings.validator';

const router = Router();

// Public — customer website reads this to check maintenance mode
router.get('/',              getSettings);

// Protected — only admins can change settings
router.put('/general',       authenticate, validateBody(generalSettingsSchema),       updateGeneralSettings);
router.put('/operations',    authenticate, validateBody(operationsSettingsSchema),     updateOperationsSettings);
router.put('/notifications', authenticate, validateBody(notificationsSettingsSchema),  updateNotificationsSettings);

export default router;
