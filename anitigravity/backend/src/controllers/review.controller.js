// Review Controller
const prisma = require('../utils/prisma');
const { getPagination, formatPaginationResponse } = require('../utils/helpers');

// Create review
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment, images } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } }
    });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Check if user purchased the product (for verified badge)
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId: req.user.id,
          status: 'DELIVERED'
        }
      }
    });

    const review = await prisma.review.create({
      data: {
        userId: req.user.id,
        productId,
        rating,
        title,
        comment,
        images: images || [],
        isVerified: !!hasPurchased
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true } }
      }
    });

    // Update product average rating
    const aggResult = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.product.update({
      where: { id: productId },
      data: {
        avgRating: aggResult._avg.rating || 0,
        reviewCount: aggResult._count.rating || 0
      }
    });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (error) {
    next(error);
  }
};

// Get product reviews
const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const { take, skip } = getPagination(page, limit);

    let orderBy = { createdAt: 'desc' };
    if (sort === 'highest') orderBy = { rating: 'desc' };
    if (sort === 'lowest') orderBy = { rating: 'asc' };

    const where = { productId };

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true } }
        }
      }),
      prisma.review.count({ where })
    ]);

    // Get rating distribution
    const ratingDistribution = await prisma.review.groupBy({
      by: ['rating'],
      where: { productId },
      _count: { rating: true }
    });

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach(r => {
      distribution[r.rating] = r._count.rating;
    });

    res.json({
      ...formatPaginationResponse(reviews, total, page, take),
      ratingDistribution: distribution
    });
  } catch (error) {
    next(error);
  }
};

// Delete review
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await prisma.review.findFirst({
      where: { id, userId: req.user.id }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await prisma.review.delete({ where: { id } });

    // Update product rating
    const aggResult = await prisma.review.aggregate({
      where: { productId: review.productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        avgRating: aggResult._avg.rating || 0,
        reviewCount: aggResult._count.rating || 0
      }
    });

    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews,
  deleteReview
};
