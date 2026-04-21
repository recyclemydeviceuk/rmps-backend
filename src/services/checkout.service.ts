import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import { PricingRule } from '../models/PricingRule';
import { Addon } from '../models/Addon';
import { generateOrderNumber } from '../utils/orderNumber';

export class CheckoutService {
  static async createCheckout(data: {
    customerName:  string;
    customerEmail: string;
    customerPhone: string;
    device:        string;
    brand:         string;
    model:         string;
    repairType:    string;
    postageType:   'print-label' | 'send-pack' | 'collection';
    collectionAddress?:  string;
    collectionPostcode?: string;
    items:         { repairTypeId: string; repairTypeName: string; modelId: string; modelName: string; quantity: number; unitPrice: number }[];
    addons?:       { addonId: string; name: string; price: number; selectedColor?: { name: string; hex: string } }[];
  }) {
    // ── Guard: 'collection' service is Preston-area-only ────────────────────
    if (data.postageType === 'collection') {
      if (!data.collectionPostcode) {
        throw Object.assign(
          new Error('Collection postcode is required for Collection & Delivery service'),
          { statusCode: 400 },
        );
      }
      const pc = data.collectionPostcode.trim().toUpperCase().replace(/\s+/g, '');
      // Preston area postcodes start with PR1–PR9 + PR25, PR26 (Leyland area).
      const isPreston = /^PR([1-9]|25|26)[A-Z0-9]+$/.test(pc);
      if (!isPreston) {
        throw Object.assign(
          new Error('Collection & Delivery is only available for customers in the Preston area (PR postcodes). Please choose another postage option.'),
          { statusCode: 400 },
        );
      }
    }
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
        // ── Guard: if the add-on has a colour palette defined in DB, a colour MUST be chosen
        const dbAddon = await Addon.findById(addon.addonId).select('name colors').lean();
        if (dbAddon?.colors && dbAddon.colors.length > 0) {
          if (!addon.selectedColor) {
            throw Object.assign(
              new Error(`Please choose a colour for "${dbAddon.name}" before placing the order.`),
              { statusCode: 400 },
            );
          }
          // Verify the selected colour is one actually offered
          const valid = dbAddon.colors.some(c =>
            c.name.toLowerCase() === addon.selectedColor!.name.toLowerCase() &&
            c.hex.toLowerCase()  === addon.selectedColor!.hex.toLowerCase(),
          );
          if (!valid) {
            throw Object.assign(
              new Error(`"${addon.selectedColor.name}" isn't an available colour for "${dbAddon.name}".`),
              { statusCode: 400 },
            );
          }
        }

        const description = addon.selectedColor
          ? `${addon.name} — ${addon.selectedColor.name}`
          : addon.name;

        orderItems.push({
          repairType:  'Add-on',
          deviceModel: addon.name,
          description,
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
      collectionAddress:  data.collectionAddress,
      collectionPostcode: data.collectionPostcode,
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

    // ── NOTE: customer + admin "new order" emails are intentionally NOT sent
    // here. They fire from PaymentService once PayPal actually captures the
    // payment — otherwise customers would get an "Order Confirmed" email for
    // an order they never paid for.

    return { orderId: order._id.toString(), orderNumber: order.orderNumber, total: order.total };
  }
}
