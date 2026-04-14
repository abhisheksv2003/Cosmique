'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { wishlistAPI, cartAPI } from '@/lib/api';
import { useCart } from '@/context/AppContext';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { setCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) fetchWishlist();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    try {
      const { data } = await wishlistAPI.getWishlist();
      setItems(data.items || []);
    } catch { } finally { setLoading(false); }
  };

  const removeItem = async (id) => {
    try {
      await wishlistAPI.removeFromWishlist(id);
      setItems(items.filter(i => i.id !== id && i.productId !== id));
    } catch { }
  };

  const moveToCart = async (product) => {
    try {
      await cartAPI.addToCart({ productId: product.id, quantity: 1 });
      const res = await cartAPI.getCart();
      setCart(res.data);
      await removeItem(product.id);
      alert('Moved to cart!');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">♥</div>
        <h3>Please sign in to view your wishlist</h3>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading wishlist...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>My Wishlist</h1>
        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">♥</div>
            <h3>Your wishlist is empty</h3>
            <p>Save items you love for later</p>
            <Link href="/products" className="btn btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {items.map(item => (
              <div key={item.id} className={styles.card}>
                <Link href={`/products/${item.product.slug || item.product.id}`} className={styles.image}>
                  <img src={item.product.thumbnail || item.product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'} alt={item.product.name} />
                </Link>
                <div className={styles.info}>
                  {item.product.brand && <span className={styles.brand}>{item.product.brand.name}</span>}
                  <Link href={`/products/${item.product.slug || item.product.id}`} className={styles.name}>{item.product.name}</Link>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{parseFloat(item.product.price).toLocaleString()}</span>
                    {item.product.compareAtPrice && <span className={styles.mrp}>₹{parseFloat(item.product.compareAtPrice).toLocaleString()}</span>}
                  </div>
                  <div className={styles.actions}>
                    <button className="btn btn-primary btn-sm" onClick={() => moveToCart(item.product)}>Add to Cart</button>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
