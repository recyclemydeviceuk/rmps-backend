import { Router } from 'express';
import { sendOtp, verifyOtp, logout, getProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { authLimiter } from '../middleware/rateLimiter';
import { sendOtpSchema, verifyOtpSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/send-otp  — request a login code
router.post('/send-otp',   authLimiter, validateBody(sendOtpSchema),   sendOtp);

// POST /api/auth/verify-otp — submit the code and get a JWT
router.post('/verify-otp', authLimiter, validateBody(verifyOtpSchema), verifyOtp);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

// GET /api/auth/profile
router.get('/profile', authenticate, getProfile);

export default router;
