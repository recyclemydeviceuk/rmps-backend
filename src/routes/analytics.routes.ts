import { Router } from 'express';
import {
  getAnalytics, getAnalyticsSummary,
  getRevenueChart, getOrdersChart,
  getTopRepairs, getTopBrands,
} from '../controllers/analytics.controller';

const router = Router();

router.get('/',         getAnalytics);
router.get('/summary',  getAnalyticsSummary);
router.get('/revenue',  getRevenueChart);
router.get('/orders',   getOrdersChart);
router.get('/repairs',  getTopRepairs);
router.get('/brands',   getTopBrands);

export default router;
