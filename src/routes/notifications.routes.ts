import { Router } from 'express';
import {
  getNotifications,
  markOneRead,
  markAllRead,
  deleteNotification,
} from '../controllers/notifications.controller';

const router = Router();

// GET  /api/notifications          — list (newest first, paginated)
router.get('/',              getNotifications);

// PATCH /api/notifications/read-all — mark every notification as read
router.patch('/read-all',   markAllRead);

// PATCH /api/notifications/:id/read — mark one as read
router.patch('/:id/read',   markOneRead);

// DELETE /api/notifications/:id     — remove one
router.delete('/:id',       deleteNotification);

export default router;
