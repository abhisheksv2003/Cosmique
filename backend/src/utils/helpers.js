// Helper Utilities

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `GC-${timestamp}-${random}`;
};

// Slugify text
const slugify = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Pagination helper
const getPagination = (page = 1, limit = 12) => {
  const take = Math.min(Math.max(parseInt(limit) || 12, 1), 50);
  const skip = (Math.max(parseInt(page) || 1, 1) - 1) * take;
  return { take, skip };
};

// Format pagination response
const formatPaginationResponse = (data, total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages,
      hasNext: parseInt(page) < totalPages,
      hasPrev: parseInt(page) > 1
    }
  };
};

module.exports = {
  generateOrderNumber,
  slugify,
  getPagination,
  formatPaginationResponse
};
