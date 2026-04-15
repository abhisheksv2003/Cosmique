'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ProductCard';
import { productAPI, categoryAPI } from '@/lib/api';
import styles from './page.module.css';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [featuredRes, categoriesRes, newRes] = await Promise.all([
        productAPI.getFeatured().catch(() => ({ data: { products: [] } })),
        categoryAPI.getAll().catch(() => ({ data: { categories: [] } })),
        productAPI.getProducts({ sort: 'newest', limit: 4 }).catch(() => ({ data: { data: [] } }))
      ]);
      setFeaturedProducts(featuredRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
      setNewArrivals(newRes.data.data || []);
    } catch (e) {
      console.error('Error loading home data:', e);
    } finally {
      setLoading(false);
    }
  };

  const defaultCategories = [
    { name: 'Skincare', slug: 'skincare', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', _count: { products: 12 } },
    { name: 'Makeup', slug: 'makeup', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400', _count: { products: 18 } },
    { name: 'Hair Care', slug: 'hair-care', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', _count: { products: 8 } },
    { name: 'Fragrances', slug: 'fragrances', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', _count: { products: 6 } },
    { name: 'Bath & Body', slug: 'bath-body', image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400', _count: { products: 10 } },
    { name: 'Nails', slug: 'nails', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400', _count: { products: 5 } }
  ];

  const defaultProducts = [
    { id: '1', name: 'Hyaluronic Acid Serum', slug: 'hyaluronic-acid-serum', price: 899, compareAtPrice: 1299, thumbnail: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300', avgRating: 4.5, reviewCount: 128, brand: { name: 'Luxe Glow' }, isFeatured: true },
    { id: '2', name: 'Matte Velvet Lipstick', slug: 'matte-velvet-lipstick-rose-petal', price: 599, compareAtPrice: 899, thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300', avgRating: 4.6, reviewCount: 245, brand: { name: 'Velvet Rose' }, isFeatured: true },
    { id: '3', name: 'Retinol Night Serum', slug: 'retinol-night-repair-serum', price: 1599, compareAtPrice: 2199, thumbnail: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=300', avgRating: 4.7, reviewCount: 72, brand: { name: 'Luxe Glow' }, isFeatured: true },
    { id: '4', name: 'Midnight Rose Perfume', slug: 'midnight-rose-eau-de-parfum', price: 2999, compareAtPrice: 4499, thumbnail: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300', avgRating: 4.9, reviewCount: 89, brand: { name: 'FragranceCo' }, isFeatured: true },
    { id: '5', name: 'Smokey Eye Palette', slug: 'smokey-eye-palette-midnight-glamour', price: 1799, compareAtPrice: 2499, thumbnail: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=300', avgRating: 4.8, reviewCount: 156, brand: { name: 'Velvet Rose' }, isFeatured: true },
    { id: '6', name: 'Vitamin C Cream', slug: 'vitamin-c-brightening-cream', price: 1299, compareAtPrice: 1799, thumbnail: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300', avgRating: 4.3, reviewCount: 95, brand: { name: 'AuraVeda' }, isFeatured: true },
    { id: '7', name: 'Keratin Shampoo', slug: 'keratin-repair-shampoo', price: 749, compareAtPrice: 999, thumbnail: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300', avgRating: 4.4, reviewCount: 167, brand: { name: 'SilkStrand' }, isFeatured: true },
    { id: '8', name: 'Rose Body Butter', slug: 'rose-honey-body-butter', price: 849, compareAtPrice: 1199, thumbnail: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=300', avgRating: 4.6, reviewCount: 112, brand: { name: 'AuraVeda' }, isFeatured: true }
  ];

  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayFeatured = featuredProducts.length > 0 ? featuredProducts : defaultProducts;
  const displayNew = newArrivals.length > 0 ? newArrivals : defaultProducts.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className={`${styles.home} bg-mesh`}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <motion.span 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroTag}
          >
            ✨ New Collection 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={styles.heroTitle}
          >
            Discover Your
            <span className={styles.heroHighlight}> True Beauty</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={styles.heroDesc}
          >
            Premium skincare, makeup, and beauty essentials curated for the modern woman. 
            Unlock your glow with our exclusive collection.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className={styles.heroBtns}
          >
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop Now →
            </Link>
            <Link href="/products?featured=true" className="btn btn-outline btn-lg">
              Featured Collection
            </Link>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className={styles.heroStats}
          >
            <div className={styles.stat}>
              <span className={styles.statNum}>500+</span>
              <span className={styles.statLabel}>Products</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>50K+</span>
              <span className={styles.statLabel}>Happy Customers</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>100%</span>
              <span className={styles.statLabel}>Authentic</span>
            </div>
          </motion.div>
        </div>
        <div className={styles.heroImages}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className={styles.heroImageMain}
          >
            <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600" alt="Beauty Products" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className={styles.heroImageFloat1}
          >
            <img src="https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300" alt="Lipstick" />
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className={styles.heroImageFloat2}
          >
            <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300" alt="Serum" />
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className={styles.features}>
        <div className={styles.container}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={styles.featureGrid}
          >
            {[
              { title: 'Free Shipping', text: 'On orders above ₹499' },
              { title: 'Secure Payment', text: '100% secure checkout' },
              { title: 'Easy Returns', text: '30-day return policy' },
              { title: '100% Authentic', text: 'Genuine products only' }
            ].map((f, i) => (
              <motion.div key={i} variants={itemVariants} className={styles.feature}>
                <div>
                  <h4>{f.title}</h4>
                  <p>{f.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Shop by Category</h2>
            <p className="section-subtitle">Explore our curated beauty categories</p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={styles.categoryGrid}
          >
            {displayCategories.map((cat, i) => (
              <motion.div key={cat.slug || i} variants={itemVariants}>
                <Link 
                  href={`/products?category=${cat.slug}`}
                  className={styles.categoryCard}
                >
                  <div className={styles.categoryImage}>
                    <img src={cat.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'} alt={cat.name} />
                    <div className={styles.categoryOverlay}></div>
                  </div>
                  <div className={styles.categoryInfo}>
                    <h3>{cat.name}</h3>
                    <span>{cat._count?.products || 0} Products</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section} style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)' }}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Featured Products</h2>
            <p className="section-subtitle">Handpicked bestsellers loved by our community</p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={styles.productGrid}
          >
            {displayFeatured.slice(0, 8).map((product, i) => (
              <motion.div key={product.id || i} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
          <div className={styles.viewAll}>
            <Link href="/products" className="btn btn-outline">View All Products →</Link>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className={styles.promo}>
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.promoContent}
        >
          <span className={styles.promoTag}>Limited Time Offer</span>
          <h2>Up to 40% Off on Skincare</h2>
          <p>Transform your skincare routine with our premium collection. Use code GLAM20 at checkout.</p>
          <Link href="/products?category=skincare" className="btn btn-primary btn-lg">
            Shop Skincare →
          </Link>
        </motion.div>
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.promoImage}
        >
          <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600" alt="Skincare Promo" />
        </motion.div>
      </section>

      {/* New Arrivals */}
      <section className={styles.section}>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>New Arrivals</h2>
            <p className="section-subtitle">Fresh drops you don&apos;t want to miss</p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className={styles.productGrid}
          >
            {displayNew.slice(0, 4).map((product, i) => (
              <motion.div key={product.id || i} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div className="section-header">
            <h2 style={{ color: 'var(--white)' }}>What Our Customers Say</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {[
              { name: 'Ananya S.', text: 'Cosmique has completely transformed my skincare routine. The products are authentic and the delivery is super fast!', rating: 5 },
              { name: 'Riya M.', text: 'I love the curated collection. Every product I have ordered has been top quality. The Midnight Rose perfume is my absolute favorite!', rating: 5 },
              { name: 'Meera K.', text: 'Best beauty shopping experience online. The packaging is beautiful and the Hyaluronic Acid serum is a game changer for my skin.', rating: 5 }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={styles.testimonialCard}
              >
                <div className={styles.testimonialStars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>&ldquo;{t.text}&rdquo;</p>
                <p className={styles.testimonialName}>{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Join the Cosmique Family</h2>
            <p>Sign up for exclusive offers, beauty tips, and new product launches.</p>
            <div className={styles.ctaForm}>
              <input type="email" placeholder="Enter your email" className={styles.ctaInput} />
              <button className="btn btn-primary btn-lg">Subscribe</button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
