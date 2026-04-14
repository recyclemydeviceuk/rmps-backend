import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { PricingRule } from '../models/PricingRule';
import { generateOrderNumber } from '../utils/orderNumber';
import { NotificationService } from './notification.service';

export class CheckoutService {
  static async createCheckout(data: {
    customerName:  string;
    customerEmail: string;
    customerPhone: string;
    device:        string;
    brand:         string;
    model:         string;
    repairType:    string;
    postageType:   'print-label' | 'send-pack';
    items:         { repairTypeId: string; repairTypeName: string; modelId: string; modelName: string; quantity: number; unitPrice: number }[];
    addons?:       { addonId: string; name: string; price: number }[];
  }) {
    // ── 1. Verify prices against the database ────────────────────────────────
    // The frontend sends slugs (not ObjectIds) for modelId / repairTypeId, so
    // we query by the denormalized string fields (modelName + repairTypeName)
    // which are always stored on PricingRule and are safe to compare directly.
    for (const item of data.items) {
      const rule = await PricingRule.findOne({
        modelName:      item.modelName,
        repairTypeName: item.repairTypeName,
        isActive:       true,
      }).lean();

      if (!rule) {
        throw Object.assign(
          new Error(`No active pricing found for "${item.modelName}" — "${item.repairTypeName}"`),
          { statusCode: 400 },
        );
      }

      // Allow a tiny floating-point tolerance (£0.01) but reject any real mismatch
      if (Math.abs(rule.price - item.unitPrice) > 0.01) {
        throw Object.assign(
          new Error(`Price mismatch for "${item.repairTypeName}": expected £${rule.price.toFixed(2)}, got £${item.unitPrice.toFixed(2)}`),
          { statusCode: 400 },
        );
      }
    }

    // ── 2. Find or create customer record ────────────────────────────────────
    let customer = await Customer.findOne({ email: data.customerEmail.toLowerCase() });
    if (!customer) {
      customer = await Customer.create({
        name:  data.customerName,
        email: data.customerEmail.toLowerCase(),
        phone: data.customerPhone,
      });
    }

    // ── 3. Build order items ─────────────────────────────────────────────────
    const orderItems = data.items.map(item => ({
      repairType:  item.repairTypeName,
      deviceModel: item.modelName,
      description: `${item.modelName} — ${item.repairTypeName}`,
      quantity:    item.quantity,
      unitPrice:   item.unitPrice,
      totalPrice:  item.quantity * item.unitPrice,
    }));

    // Add addons as line items if any
    if (data.addons?.length) {
      for (const addon of data.addons) {
        orderItems.push({
          repairType:  'Add-on',
          deviceModel: addon.name,
          description: addon.name,
          quantity:    1,
          unitPrice:   addon.price,
          totalPrice:  addon.price,
        });
      }
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);

    // ── 4. Generate order number and create order ────────────────────────────
    const orderNumber = await generateOrderNumber();

    const order = await Order.create({
      orderNumber,
      customerId:    customer._id,
      customerName:  data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      device:        data.device,
      brand:         data.brand,
      model:         data.model,
      repairType:    data.repairType,
      postageType:   data.postageType,
      items:         orderItems,
      subtotal,
      total:         subtotal,
      status:        'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'unpaid',
    });

    // ── 5. Update customer stats ─────────────────────────────────────────────
    await Customer.findByIdAndUpdate(customer._id, {
      $inc: { totalOrders: 1 },
      lastOrderDate: new Date(),
    });

    // Fire notification (non-blocking — never fails the checkout)
    NotificationService.newOrder(
      order.orderNumber,
      data.model,
      data.repairType,
      order._id.toString(),
    ).catch(() => {});

    return { orderId: order._id.toString(), orderNumber: order.orderNumber, total: order.total };
  }
}
