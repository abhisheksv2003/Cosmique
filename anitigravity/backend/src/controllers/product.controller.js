// Product Controller
const prisma = require('../utils/prisma');
const { slugify, getPagination, formatPaginationResponse } = require('../utils/helpers');

// Get all products (with filters, search, pagination)
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, search, category, brand, minPrice, maxPrice, sort, featured, tag, concern, ingredient } = req.query;
    const { take, skip } = getPagination(page, limit);

    // Build where clause
    const where = { isActive: true };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search.toLowerCase() } }
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (concern) {
      where.tags = { ...where.tags, has: concern.toLowerCase() };
    }

    if (ingredient) {
      where.tags = { ...where.tags, has: ingredient.toLowerCase() };
    }

    if (brand) {
      where.brand = { slug: brand };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (tag) {
      where.tags = { has: tag.toLowerCase() };
    }

    // Build sort
    let orderBy = { createdAt: 'desc' };
    switch (sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'rating': orderBy = { avgRating: 'desc' }; break;
      case 'popular': orderBy = { reviewCount: 'desc' }; break;
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } }
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json(formatPaginationResponse(products, total, page, take));
  } catch (error) {
    next(error);
  }
};

// Get single product
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        isActive: true
      },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        variants: true,
        reviews: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true } }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product });
  } catch (error) {
    next(error);
  }
};

// Create product (Admin)
const createProduct = async (req, res, next) => {
  try {
    const {
      name, description, shortDescription, price, compareAtPrice,
      costPrice, sku, stock, images, thumbnail, weight,
      ingredients, howToUse, isFeatured, tags, categoryId, brandId
    } = req.body;

    const slug = slugify(name) + '-' + Date.now().toString(36);

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPrice: costPrice ? parseFloat(costPrice) : null,
        sku,
        stock: parseInt(stock) || 0,
        images: images || [],
        thumbnail,
        weight: weight ? parseFloat(weight) : null,
        ingredients,
        howToUse,
        isFeatured: isFeatured || false,
        tags: tags || [],
        categoryId,
        brandId
      },
      include: {
        category: true,
        brand: true
      }
    });

    res.status(201).json({ message: 'Product created', product });
  } catch (error) {
    next(error);
  }
};

// Update product (Admin)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse numeric fields
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.compareAtPrice) updateData.compareAtPrice = parseFloat(updateData.compareAtPrice);
    if (updateData.costPrice) updateData.costPrice = parseFloat(updateData.costPrice);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock);
    if (updateData.weight) updateData.weight = parseFloat(updateData.weight);

    // Update slug if name changed
    if (updateData.name) {
      updateData.slug = slugify(updateData.name) + '-' + Date.now().toString(36);
    }

    // Remove fields that shouldn't be updated directly
    delete updateData.avgRating;
    delete updateData.reviewCount;

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        brand: true
      }
    });

    res.json({ message: 'Product updated', product });
  } catch (error) {
    next(error);
  }
};

// Delete product (Admin)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// Get featured products
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } }
      }
    });

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};
