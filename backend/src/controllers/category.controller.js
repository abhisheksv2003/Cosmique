// Category Controller
const prisma = require('../utils/prisma');
const { slugify } = require('../utils/helpers');

// Get all categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: { select: { products: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

// Get single category with products
const getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        _count: { select: { products: true } }
      }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category });
  } catch (error) {
    next(error);
  }
};

// Create category (Admin)
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentId } = req.body;
    const slug = slugify(name);

    const category = await prisma.category.create({
      data: { name, slug, description, image, parentId }
    });

    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    next(error);
  }
};

// Update category (Admin)
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentId } = req.body;

    const data = {};
    if (name) { data.name = name; data.slug = slugify(name); }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (parentId !== undefined) data.parentId = parentId;

    const category = await prisma.category.update({
      where: { id },
      data
    });

    res.json({ message: 'Category updated', category });
  } catch (error) {
    next(error);
  }
};

// Delete category (Admin)
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.category.delete({ where: { id } });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
