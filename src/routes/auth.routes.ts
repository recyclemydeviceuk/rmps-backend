import { Router } from 'express';
import { login, logout, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { loginSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/login
router.post('/login', authLimiter, validateBody(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

export default router;
