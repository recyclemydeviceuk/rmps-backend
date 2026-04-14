import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

// Route modules
import authRoutes        from './auth.routes';
import ordersRoutes      from './orders.routes';
import customersRoutes   from './customers.routes';
import deviceTypesRoutes from './deviceTypes.routes';
import brandsRoutes      from './brands.routes';
import seriesRoutes      from './series.routes';
import modelsRoutes      from './models.routes';
import repairTypesRoutes from './repairTypes.routes';
import pricingRoutes     from './pricing.routes';
import addonsRoutes      from './addons.routes';
import formsRoutes       from './forms.routes';
import analyticsRoutes   from './analytics.routes';
import settingsRoutes    from './settings.routes';
import checkoutRoutes    from './checkout.routes';
import paymentRoutes     from './payment.routes';
import uploadRoutes         from './upload.routes';
import publicRoutes         from './public.routes';
import trackRoutes          from './track.routes';
import notificationsRoutes  from './notifications.routes';
import blogRoutes           from './blog.routes';

export const apiRouter = Router();

// Apply general rate limiting to all API routes
apiRouter.use(apiLimiter);

// ── Public routes (no auth) ───────────────────────────────
apiRouter.use('/auth',     authRoutes);
apiRouter.use('/public',   publicRoutes);
apiRouter.use('/track',    trackRoutes);
apiRouter.use('/forms',    formsRoutes);      // POST (form submissions) are public
apiRouter.use('/checkout', checkoutRoutes);
apiRouter.use('/payment',  paymentRoutes);
apiRouter.use('/settings', settingsRoutes);   // GET is public; PUT routes auth themselves
apiRouter.use('/blog',     blogRoutes);       // has both public & admin routes internally

// ── Protected admin routes ────────────────────────────────
apiRouter.use(authenticate);

apiRouter.use('/orders',        ordersRoutes);
apiRouter.use('/customers',     customersRoutes);
apiRouter.use('/device-types',  deviceTypesRoutes);
apiRouter.use('/brands',        brandsRoutes);
apiRouter.use('/series',        seriesRoutes);
apiRouter.use('/models',        modelsRoutes);
apiRouter.use('/repair-types',  repairTypesRoutes);
apiRouter.use('/pricing',       pricingRoutes);
apiRouter.use('/addons',        addonsRoutes);
apiRouter.use('/analytics',     analyticsRoutes);
apiRouter.use('/upload',        uploadRoutes);
apiRouter.use('/notifications', notificationsRoutes);
