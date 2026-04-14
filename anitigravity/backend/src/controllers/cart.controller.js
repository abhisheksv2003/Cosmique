// Cart Controller
const prisma = require('../utils/prisma');

// Get cart
const getCart = async (req, res, next) => {
  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            compareAtPrice: true,
            thumbnail: true,
            images: true,
            stock: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate totals
    let subtotal = 0;
    const items = cartItems.map(item => {
      const itemTotal = parseFloat(item.product.price) * item.quantity;
      subtotal += itemTotal;
      return {
        ...item,
        itemTotal
      };
    });

    res.json({
      items,
      summary: {
        itemCount: items.length,
        subtotal: subtotal.toFixed(2),
        shipping: subtotal > 499 ? 0 : 49,
        total: (subtotal + (subtotal > 499 ? 0 : 49)).toFixed(2)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Check product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Upsert cart item
    const cartItem = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId
        }
      },
      update: {
        quantity: { increment: quantity }
      },
      create: {
        userId: req.user.id,
        productId,
        quantity
      },
      include: {
        product: {
          select: { id: true, name: true, price: true, thumbnail: true, stock: true }
        }
      }
    });

    // Validate quantity doesn't exceed stock
    if (cartItem.quantity > product.stock) {
      await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: product.stock }
      });
    }

    res.status(201).json({ message: 'Added to cart', cartItem });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId: req.user.id },
      include: { product: { select: { stock: true } } }
    });

    if (!cartItem) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity > cartItem.product.stock) {
      return res.status(400).json({ error: 'Quantity exceeds available stock' });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: {
        product: {
          select: { id: true, name: true, price: true, thumbnail: true, stock: true }
        }
      }
    });

    res.json({ message: 'Cart updated', cartItem: updated });
  } catch (error) {
    next(error);
  }
};

// Remove from cart
const removeFromCart = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.cartItem.deleteMany({
      where: { id, userId: req.user.id }
    });

    res.json({ message: 'Removed from cart' });
  } catch (error) {
    next(error);
  }
};

// Clear cart
const clearCart = async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user.id }
    });

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
