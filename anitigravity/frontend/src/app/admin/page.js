'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { adminAPI } from '@/lib/api';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isAuthenticated && user?.role === 'ADMIN') fetchDashboard();
    else setLoading(false);
  }, [isAuthenticated, user]);

  const fetchDashboard = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
    } catch {
      // Fallback demo data
      setStats({ totalUsers: 1250, totalProducts: 89, totalOrders: 3420, totalRevenue: 1567890 });
      setRecentOrders([]);
    } finally { setLoading(false); }
  };

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3>Access Denied</h3>
        <p>You need admin privileges to access this page</p>
        <Link href="/" className="btn btn-primary">Go Home</Link>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, {user?.firstName}! Here&apos;s what&apos;s happening.</p>
          </div>
          <Link href="/products" className="btn btn-primary">+ Add Product</Link>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard} style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className={styles.statIcon}>👥</div>
            <div>
              <span className={styles.statNumber}>{stats?.totalUsers?.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Customers</span>
            </div>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid var(--secondary)' }}>
            <div className={styles.statIcon}>💄</div>
            <div>
              <span className={styles.statNumber}>{stats?.totalProducts?.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Products</span>
            </div>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid var(--accent)' }}>
            <div className={styles.statIcon}>📦</div>
            <div>
              <span className={styles.statNumber}>{stats?.totalOrders?.toLocaleString()}</span>
              <span className={styles.statLabel}>Total Orders</span>
            </div>
          </div>
          <div className={styles.statCard} style={{ borderLeft: '4px solid var(--success)' }}>
            <div className={styles.statIcon}>💰</div>
            <div>
              <span className={styles.statNumber}>₹{parseFloat(stats?.totalRevenue || 0).toLocaleString()}</span>
              <span className={styles.statLabel}>Total Revenue</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {['overview', 'orders', 'products', 'users'].map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'overview' && (
            <div className={styles.overviewGrid}>
              <div className={styles.panel}>
                <h3>Recent Orders</h3>
                {recentOrders.length > 0 ? (
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>
                      <span>Order</span>
                      <span>Customer</span>
                      <span>Status</span>
                      <span>Total</span>
                    </div>
                    {recentOrders.map((order, i) => (
                      <div key={i} className={styles.tableRow}>
                        <span className={styles.orderNum}>{order.orderNumber}</span>
                        <span>{order.user?.firstName} {order.user?.lastName}</span>
                        <span className={`badge badge-status badge-${order.status?.toLowerCase()}`}>{order.status}</span>
                        <span className="font-semibold">₹{parseFloat(order.total).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted" style={{ padding: 'var(--space-xl)' }}>No recent orders to display. Orders will appear here once customers start purchasing.</p>
                )}
              </div>

              <div className={styles.panel}>
                <h3>Quick Actions</h3>
                <div className={styles.quickActions}>
                  <Link href="/products" className={styles.actionCard}>
                    <span className={styles.actionIcon}>➕</span>
                    <span>Add New Product</span>
                  </Link>
                  <Link href="/admin" className={styles.actionCard}>
                    <span className={styles.actionIcon}>📊</span>
                    <span>View Analytics</span>
                  </Link>
                  <Link href="/admin" className={styles.actionCard}>
                    <span className={styles.actionIcon}>📋</span>
                    <span>Manage Categories</span>
                  </Link>
                  <Link href="/admin" className={styles.actionCard}>
                    <span className={styles.actionIcon}>🎫</span>
                    <span>Manage Coupons</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className={styles.panel}>
              <h3>All Orders</h3>
              <p className="text-muted" style={{ padding: 'var(--space-lg)' }}>
                Order management section. Connect to the backend to see live data.
              </p>
            </div>
          )}

          {activeTab === 'products' && (
            <div className={styles.panel}>
              <h3>Product Management</h3>
              <p className="text-muted" style={{ padding: 'var(--space-lg)' }}>
                Product management section. Connect to the backend to manage products.
              </p>
            </div>
          )}

          {activeTab === 'users' && (
            <div className={styles.panel}>
              <h3>User Management</h3>
              <p className="text-muted" style={{ padding: 'var(--space-lg)' }}>
                User management section. Connect to the backend to manage users.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
