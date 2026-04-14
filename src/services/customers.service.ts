import { Customer } from '../models/Customer';
import { Order } from '../models/Order';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export class CustomersService {
  static async getCustomers(query: Record<string, unknown>) {
    const { page, limit, skip } = parsePagination(query.page as string, query.limit as string);
    const filter: Record<string, unknown> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      const q = new RegExp(query.search as string, 'i');
      filter.$or = [{ name: q }, { email: q }, { phone: q }];
    }
    const [data, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Customer.countDocuments(filter),
    ]);
    return { data, meta: buildPaginationMeta(page, limit, total) };
  }

  static async getCustomerById(id: string) {
    const customer = await Customer.findById(id);
    if (!customer) throw Object.assign(new Error('Customer not found'), { statusCode: 404 });
    return customer;
  }

  static async updateCustomer(id: string, data: unknown) {
    const customer = await Customer.findByIdAndUpdate(id, data as object, { new: true, runValidators: true });
    if (!customer) throw Object.assign(new Error('Customer not found'), { statusCode: 404 });
    return customer;
  }

  static async deleteCustomer(id: string) {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) throw Object.assign(new Error('Customer not found'), { statusCode: 404 });
  }

  static async getCustomerOrders(customerId: string) {
    return Order.find({ customerId }).sort({ createdAt: -1 });
  }
}
