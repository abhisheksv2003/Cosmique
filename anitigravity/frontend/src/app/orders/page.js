'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { orderAPI } from '@/lib/api';
import styles from './orders.module.css';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) fetchOrders();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const { data } = await orderAPI.getOrders();
      setOrders(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  const cancelOrder = async (id) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(id);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot cancel this order');
    }
  };

  const getStatusColor = (status) => {
    const map = { PENDING: 'pending', CONFIRMED: 'confirmed', PROCESSING: 'confirmed', SHIPPED: 'shipped', DELIVERED: 'delivered', CANCELLED: 'cancelled', RETURNED: 'cancelled' };
    return map[status] || 'pending';
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📦</div>
        <h3>Please sign in to view your orders</h3>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading orders...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>My Orders</h1>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here</p>
            <Link href="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map(order => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div>
                    <span className={styles.orderNumber}>Order #{order.orderNumber}</span>
                    <span className={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <div className={styles.orderHeaderRight}>
                    <span className={`badge badge-status badge-${getStatusColor(order.status)}`}>{order.status}</span>
                    <span className={styles.orderTotal}>₹{parseFloat(order.total).toLocaleString()}</span>
                  </div>
                </div>
                <div className={styles.orderItems}>
                  {order.items?.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <div className={styles.orderItemImage}>
                        <img src={item.image || item.product?.thumbnail || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100'} alt={item.name} />
                      </div>
                      <div className={styles.orderItemInfo}>
                        <span className={styles.orderItemName}>{item.name}</span>
                        <span className={styles.orderItemQty}>Qty: {item.quantity} × ₹{parseFloat(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.orderActions}>
                  {['PENDING', 'CONFIRMED'].includes(order.status) && (
                    <button className="btn btn-ghost btn-sm" onClick={() => cancelOrder(order.id)} style={{ color: 'var(--error)' }}>
                      Cancel Order
                    </button>
                  )}
                  <Link href={`/orders/${order.id}`} className="btn btn-outline btn-sm">View Details</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
