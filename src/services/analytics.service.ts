import { Order } from '../models/Order';
import { Customer } from '../models/Customer';

export class AnalyticsService {
  static async getSummary() {
    const [totalOrdersData, completedData, pendingData, customersCount] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      Order.countDocuments({ status: 'completed' }),
      Order.countDocuments({ status: { $in: ['pending', 'paid', 'processing'] } }),
      Customer.countDocuments(),
    ]);
    const totalRevenue = totalOrdersData[0]?.total ?? 0;
    const totalOrders  = totalOrdersData[0]?.count ?? 0;
    return {
      totalRevenue,
      revenueChange:     0,
      totalOrders,
      ordersChange:      0,
      completedOrders:   completedData,
      pendingOrders:     pendingData,
      totalCustomers:    customersCount,
      customersChange:   0,
      averageOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
    };
  }

  static async getRevenueChart(period = '30d') {
    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    return Order.aggregate([
      { $match: { createdAt: { $gte: since }, status: { $in: ['paid', 'completed'] } } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$total' },
        orders:  { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: 1, orders: 1, _id: 0 } },
    ]);
  }

  static async getOrdersChart(period = '30d') {
    return AnalyticsService.getRevenueChart(period);
  }

  static async getTopRepairs() {
    return Order.aggregate([
      { $group: { _id: '$repairType', value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 10 },
      { $project: { label: '$_id', value: 1, _id: 0 } },
    ]);
  }

  static async getTopBrands() {
    return Order.aggregate([
      { $group: { _id: '$brand', value: { $sum: '$total' } } },
      { $sort: { value: -1 } },
      { $limit: 10 },
      { $project: { label: '$_id', value: 1, _id: 0 } },
    ]);
  }

  static async getFullAnalytics() {
    const [summary, revenueChart, topRepairs, topBrands] = await Promise.all([
      AnalyticsService.getSummary(),
      AnalyticsService.getRevenueChart(),
      AnalyticsService.getTopRepairs(),
      AnalyticsService.getTopBrands(),
    ]);
    return { summary, revenueChart, ordersChart: revenueChart, topRepairs, topBrands };
  }
}
