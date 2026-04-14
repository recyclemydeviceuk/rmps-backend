export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesDataPoint {
  date:     string;
  revenue?: number;
  orders?:  number;
}

export interface AnalyticsSummary {
  totalRevenue:       number;
  revenueChange:      number;  // % change vs previous period
  totalOrders:        number;
  ordersChange:       number;
  completedOrders:    number;
  pendingOrders:      number;
  averageOrderValue:  number;
}

export interface AnalyticsData {
  summary:        AnalyticsSummary;
  revenueChart:   TimeSeriesDataPoint[];
  ordersChart:    TimeSeriesDataPoint[];
  topRepairs:     ChartDataPoint[];
  topBrands:      ChartDataPoint[];
  topDevices:     ChartDataPoint[];
}
