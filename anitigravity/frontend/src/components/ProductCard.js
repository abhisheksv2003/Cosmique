'use client';

import Link from 'next/link';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const discount = product.compareAtPrice
    ? Math.round(((parseFloat(product.compareAtPrice) - parseFloat(product.price)) / parseFloat(product.compareAtPrice)) * 100)
    : 0;

  const renderStars = (rating) => {
    const stars = [];
    const r = parseFloat(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= r ? styles.starFilled : styles.starEmpty}>★</span>
      );
    }
    return stars;
  };

  return (
    <Link href={`/products/${product.slug || product.id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'}
          alt={product.name}
          className={styles.image}
          loading="lazy"
        />
        {discount > 0 && (
          <span className={styles.discount}>-{discount}%</span>
        )}
        {product.isFeatured && (
          <span className={styles.featured}>★ Featured</span>
        )}
        <div className={styles.overlay}>
          <button className={styles.quickView}>Quick View</button>
        </div>
      </div>
      <div className={styles.info}>
        {product.brand && (
          <span className={styles.brand}>{product.brand.name || product.brand}</span>
        )}
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.ratingRow}>
          <div className={styles.stars}>
            {renderStars(product.avgRating)}
          </div>
          <span className={styles.reviewCount}>({product.reviewCount || 0})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{parseFloat(product.price).toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className={styles.comparePrice}>₹{parseFloat(product.compareAtPrice).toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
