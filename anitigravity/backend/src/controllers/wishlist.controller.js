// Wishlist Controller
const prisma = require('../utils/prisma');

// Get wishlist
const getWishlist = async (req, res, next) => {
  try {
    const items = await prisma.wishlistItem.findMany({
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
            avgRating: true,
            reviewCount: true,
            stock: true,
            isActive: true,
            brand: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// Add to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        userId_productId: { userId: req.user.id, productId }
      },
      update: {},
      create: {
        userId: req.user.id,
        productId
      },
      include: {
        product: {
          select: { id: true, name: true, thumbnail: true, price: true }
        }
      }
    });

    res.status(201).json({ message: 'Added to wishlist', item });
  } catch (error) {
    next(error);
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.wishlistItem.deleteMany({
      where: {
        OR: [
          { id, userId: req.user.id },
          { productId: id, userId: req.user.id }
        ]
      }
    });

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

// Check if product is in wishlist
const checkWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const item = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId: req.user.id, productId }
      }
    });

    res.json({ inWishlist: !!item });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
};
