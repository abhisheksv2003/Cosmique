'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { useCart } from '@/context/AppContext';
import { cartAPI } from '@/lib/api';
import styles from './cart.module.css';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, summary, setCart, clearCart: clearCartState } = useCart();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    if (isAuthenticated) { fetchCart(); } else { setLoading(false); }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      const { data } = await cartAPI.getCart();
      setCart(data);
    } catch { } finally { setLoading(false); }
  };

  const updateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    setUpdating(itemId);
    try {
      await cartAPI.updateItem(itemId, { quantity: newQty });
      await fetchCart();
      toast.success('Cart updated');
    } catch (err) { 
      toast.error(err.response?.data?.error || 'Error updating'); 
    }
    finally { setUpdating(null); }
  };

  const removeItem = async (itemId) => {
    setUpdating(itemId);
    try {
      await cartAPI.removeItem(itemId);
      await fetchCart();
    } catch { } finally { setUpdating(null); }
  };

  const handleClearCart = async () => {
    try {
      await cartAPI.clearCart();
      clearCartState();
    } catch { }
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🛒</div>
        <h3>Please sign in to view your cart</h3>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading cart...</div>;

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven&apos;t added anything yet</p>
            <Link href="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              <div className={styles.cartHeader}>
                <span>{items.length} item{items.length > 1 ? 's' : ''} in cart</span>
                <button className={styles.clearBtn} onClick={handleClearCart}>Clear All</button>
              </div>
              {items.map((item) => (
                <div key={item.id} className={`${styles.cartItem} ${updating === item.id ? styles.itemUpdating : ''}`}>
                  <Link href={`/products/${item.product.slug || item.product.id}`} className={styles.itemImage}>
                    <img src={item.product.thumbnail || item.product.images?.[0] || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200'} alt={item.product.name} />
                  </Link>
                  <div className={styles.itemInfo}>
                    <Link href={`/products/${item.product.slug || item.product.id}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>
                    <div className={styles.itemPriceRow}>
                      <span className={styles.itemPrice}>₹{parseFloat(item.product.price).toLocaleString()}</span>
                      {item.product.compareAtPrice && (
                        <span className={styles.itemMrp}>₹{parseFloat(item.product.compareAtPrice).toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.product.stock}>+</button>
                    </div>
                    <span className={styles.itemTotal}>₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.summary}>
              <div className={styles.summaryCard}>
                <h3>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal ({items.length} items)</span>
                  <span>₹{parseFloat(summary.subtotal).toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span className={summary.shipping === 0 ? styles.freeShipping : ''}>
                    {summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}
                  </span>
                </div>
                {parseFloat(summary.subtotal) < 499 && (
                  <div className={styles.shippingNote}>
                    Add ₹{(499 - parseFloat(summary.subtotal)).toFixed(0)} more for free shipping
                  </div>
                )}
                <div className={styles.summaryDivider}></div>
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>₹{parseFloat(summary.total).toLocaleString()}</span>
                </div>

                <Link href="/checkout" className={`btn btn-primary w-full ${styles.checkoutBtn}`}>
                  Proceed to Checkout →
                </Link>

                <div className={styles.secureNote}>
                  <span>🔒</span> Secure checkout with SSL encryption
                </div>
              </div>

              <div className={styles.couponSection}>
                <h4>Have a coupon?</h4>
                <div className={styles.couponInput}>
                  <input type="text" placeholder="Enter coupon code" />
                  <button className="btn btn-outline btn-sm">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
