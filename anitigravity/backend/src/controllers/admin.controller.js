// Admin Controller
const prisma = require('../utils/prisma');
const { getPagination, formatPaginationResponse } = require('../utils/helpers');

// Dashboard Stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      revenueResult,
      recentOrders,
      ordersByStatus,
      topProducts,
      monthlySales
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          _count: { select: { items: true } }
        }
      }),
      prisma.order.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
      }),
      // Monthly sales for last 6 months
      prisma.$queryRaw`
        SELECT 
          TO_CHAR(DATE_TRUNC('month', "createdAt"), 'YYYY-MM') as month,
          CAST(SUM("total") as FLOAT) as revenue,
          COUNT(*)::int as orders
        FROM orders 
        WHERE "createdAt" >= NOW() - INTERVAL '6 months'
          AND "paymentStatus" = 'PAID'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `
    ]);

    // Get product names for top products
    let topProductsWithNames = [];
    if (topProducts.length > 0) {
      const productIds = topProducts.map(p => p.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, thumbnail: true, price: true }
      });

      topProductsWithNames = topProducts.map(tp => ({
        ...tp,
        product: products.find(p => p.id === tp.productId)
      }));
    }

    const statusMap = {};
    ordersByStatus.forEach(s => { statusMap[s.status] = s._count.status; });

    res.json({
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: revenueResult._sum.total || 0
      },
      recentOrders,
      ordersByStatus: statusMap,
      topProducts: topProductsWithNames,
      monthlySales
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin)
const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    const { take, skip } = getPagination(page, limit);

    const where = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take,
        skip,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          isVerified: true,
          createdAt: true,
          _count: { select: { orders: true } }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json(formatPaginationResponse(users, total, page, take));
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const { take, skip } = getPagination(page, limit);

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        take,
        skip,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true } },
          _count: { select: { items: true } }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json(formatPaginationResponse(orders, total, page, take));
  } catch (error) {
    next(error);
  }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        items: true
      }
    });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    next(error);
  }
};

// Low stock products (Admin)
const getLowStockProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { lte: 5 }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        stock: true,
        lowStockAlert: true,
        thumbnail: true,
        price: true
      },
      orderBy: { stock: 'asc' },
      take: 20
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getAllOrders,
  updateOrderStatus,
  getLowStockProducts
};
