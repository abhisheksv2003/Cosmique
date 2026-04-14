'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { productAPI, categoryAPI } from '@/lib/api';
import styles from './products.module.css';

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: '',
    maxPrice: '',
    featured: searchParams.get('featured') || '',
    page: 1
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadCategories = async () => {
    try {
      const { data } = await categoryAPI.getAll();
      setCategories(data.categories || []);
    } catch {
      setCategories([
        { name: 'Skincare', slug: 'skincare' },
        { name: 'Makeup', slug: 'makeup' },
        { name: 'Hair Care', slug: 'hair-care' },
        { name: 'Fragrances', slug: 'fragrances' },
        { name: 'Bath & Body', slug: 'bath-body' },
        { name: 'Nails', slug: 'nails' }
      ]);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category) params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.featured) params.featured = filters.featured;
      params.page = filters.page;
      params.limit = 12;

      const { data } = await productAPI.getProducts(params);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch {
      // Use fallback products
      setProducts([
        { id: '1', name: 'Hyaluronic Acid Serum', slug: 'hyaluronic-acid-serum', price: 899, compareAtPrice: 1299, thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', avgRating: 4.5, reviewCount: 128, brand: { name: 'Luxe Glow' }, isFeatured: true },
        { id: '2', name: 'Matte Velvet Lipstick', slug: 'matte-velvet-lipstick-rose-petal', price: 599, compareAtPrice: 899, thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300', avgRating: 4.6, reviewCount: 245, brand: { name: 'Velvet Rose' }, isFeatured: true },
        { id: '3', name: 'Retinol Night Serum', slug: 'retinol-night-repair-serum', price: 1599, compareAtPrice: 2199, thumbnail: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300', avgRating: 4.7, reviewCount: 72, brand: { name: 'Luxe Glow' } },
        { id: '4', name: 'Midnight Rose Perfume', slug: 'midnight-rose-eau-de-parfum', price: 2999, compareAtPrice: 4499, thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300', avgRating: 4.9, reviewCount: 89, brand: { name: 'FragranceCo' }, isFeatured: true },
        { id: '5', name: 'Smokey Eye Palette', slug: 'smokey-eye-palette-midnight-glamour', price: 1799, compareAtPrice: 2499, thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', avgRating: 4.8, reviewCount: 156, brand: { name: 'Velvet Rose' } },
        { id: '6', name: 'Vitamin C Brightening Cream', slug: 'vitamin-c-brightening-cream', price: 1299, compareAtPrice: 1799, thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300', avgRating: 4.3, reviewCount: 95, brand: { name: 'AuraVeda' } },
        { id: '7', name: 'Keratin Repair Shampoo', slug: 'keratin-repair-shampoo', price: 749, compareAtPrice: 999, thumbnail: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300', avgRating: 4.4, reviewCount: 167, brand: { name: 'SilkStrand' } },
        { id: '8', name: 'Rose & Honey Body Butter', slug: 'rose-honey-body-butter', price: 849, compareAtPrice: 1199, thumbnail: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300', avgRating: 4.6, reviewCount: 112, brand: { name: 'AuraVeda' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className={styles.productsPage}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1>{filters.category ? filters.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}</h1>
          {filters.search && <p>Search results for &ldquo;{filters.search}&rdquo;</p>}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterSection}>
                <h3>Categories</h3>
                <ul className={styles.categoryList}>
                  <li>
                    <button
                      className={`${styles.categoryBtn} ${!filters.category ? styles.active : ''}`}
                      onClick={() => updateFilter('category', '')}
                    >
                      All Products
                    </button>
                  </li>
                  {categories.map(cat => (
                    <li key={cat.slug}>
                      <button
                        className={`${styles.categoryBtn} ${filters.category === cat.slug ? styles.active : ''}`}
                        onClick={() => updateFilter('category', cat.slug)}
                      >
                        {cat.name}
                        {cat._count?.products > 0 && <span>({cat._count.products})</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.filterSection}>
                <h3>Price Range</h3>
                <div className={styles.priceRange}>
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    className={styles.priceInput}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    className={styles.priceInput}
                  />
                </div>
              </div>

              <div className={styles.filterSection}>
                <h3>Rating</h3>
                <div className={styles.ratingFilters}>
                  {[4, 3, 2].map(r => (
                    <label key={r} className={styles.ratingOption}>
                      <span className={styles.ratingStars}>{'★'.repeat(r)}{'☆'.repeat(5-r)}</span>
                      <span>& above</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className={styles.main}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <span className={styles.resultCount}>
                  {pagination.total || products.length} products found
                </span>
                <div className={styles.sortWrapper}>
                  <label>Sort by:</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className={styles.sortSelect}
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                    <option value="name_asc">Name: A-Z</option>
                  </select>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className={styles.grid}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={styles.skeleton}>
                      <div className={styles.skeletonImage}></div>
                      <div className={styles.skeletonInfo}>
                        <div className={styles.skeletonLine}></div>
                        <div className={styles.skeletonLineShort}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className={styles.grid}>
                    {products.map((product, i) => (
                      <div key={product.id || i} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageBtn}
                        disabled={!pagination.hasPrev}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                      >
                        ← Previous
                      </button>
                      <span className={styles.pageInfo}>
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      <button
                        className={styles.pageBtn}
                        disabled={!pagination.hasNext}
                        onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button className="btn btn-primary" onClick={() => setFilters({ search: '', category: '', sort: 'newest', minPrice: '', maxPrice: '', featured: '', page: 1 })}>
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading products...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
