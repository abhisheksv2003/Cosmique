// Order Controller
const prisma = require('../utils/prisma');
const { generateOrderNumber, getPagination, formatPaginationResponse } = require('../utils/helpers');

// Create order from cart
const createOrder = async (req, res, next) => {
  try {
    const { addressId, paymentMethod, notes } = req.body;

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: { id: addressId, userId: req.user.id }
    });
    if (!address) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      if (!item.product.isActive) {
        return res.status(400).json({ error: `${item.product.name} is no longer available` });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.product.name}` });
      }

      const itemPrice = parseFloat(item.product.price);
      subtotal += itemPrice * item.quantity;

      orderItems.push({
        productId: item.product.id,
        name: item.product.name,
        price: itemPrice,
        quantity: item.quantity,
        image: item.product.thumbnail || (item.product.images[0] || null)
      });
    }

    const shippingCost = subtotal > 499 ? 0 : 49;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shippingCost + tax;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: req.user.id,
          addressId,
          subtotal,
          shippingCost,
          tax,
          total,
          paymentMethod: paymentMethod || 'COD',
          notes,
          items: {
            create: orderItems
          }
        },
        include: {
          items: true,
          address: true
        }
      });

      // Update stock
      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { userId: req.user.id }
      });

      return newOrder;
    });

    res.status(201).json({ message: 'Order created', order });
  } catch (error) {
    next(error);
  }
};

// Get user orders
const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { take, skip } = getPagination(page, limit);

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: { select: { slug: true, thumbnail: true } }
            }
          },
          address: true
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json(formatPaginationResponse(orders, total, page, take));
  } catch (error) {
    next(error);
  }
};

// Get single order
const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
        userId: req.user.id
      },
      include: {
        items: {
          include: {
            product: { select: { slug: true, thumbnail: true, images: true } }
          }
        },
        address: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    next(error);
  }
};

// Cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: { items: true }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    // Cancel and restore stock
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }
    });

    res.json({ message: 'Order cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder
};
