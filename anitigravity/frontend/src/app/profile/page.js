'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { authAPI } from '@/lib/api';
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchProfile();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const { data } = await authAPI.getProfile();
      setProfile(data.user);
      setFormData({ firstName: data.user.firstName, lastName: data.user.lastName, phone: data.user.phone || '' });
    } catch { } finally { setLoading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(formData);
      setProfile({ ...profile, ...data.user });
      updateUser(data.user);
      setEditing(false);
    } catch { alert('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">👤</div>
        <h3>Please sign in to view your profile</h3>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading profile...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.profileCard}>
              <div className={styles.avatar}>
                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
              </div>
              <h3>{profile?.firstName} {profile?.lastName}</h3>
              <p>{profile?.email}</p>
              {profile?.role === 'ADMIN' && (
                <span className="badge badge-featured">Admin</span>
              )}
            </div>
            <nav className={styles.sideNav}>
              <Link href="/profile" className={`${styles.sideNavLink} ${styles.active}`}>👤 Profile</Link>
              <Link href="/orders" className={styles.sideNavLink}>📦 Orders</Link>
              <Link href="/wishlist" className={styles.sideNavLink}>♥ Wishlist</Link>
              <Link href="/cart" className={styles.sideNavLink}>🛒 Cart</Link>
              {profile?.role === 'ADMIN' && (
                <Link href="/admin" className={styles.sideNavLink}>⚙️ Admin Panel</Link>
              )}
            </nav>
          </aside>

          {/* Main Content */}
          <div className={styles.main}>
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Personal Information</h2>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(!editing)}>
                  {editing ? 'Cancel' : '✏️ Edit'}
                </button>
              </div>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>First Name</label>
                  {editing ? (
                    <input className="form-input" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                  ) : (
                    <p>{profile?.firstName}</p>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <label>Last Name</label>
                  {editing ? (
                    <input className="form-input" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                  ) : (
                    <p>{profile?.lastName}</p>
                  )}
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <p>{profile?.email}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Phone</label>
                  {editing ? (
                    <input className="form-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                  ) : (
                    <p>{profile?.phone || 'Not set'}</p>
                  )}
                </div>
              </div>
              {editing && (
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>

            <div className={styles.section}>
              <h2>Saved Addresses</h2>
              <div className={styles.addressGrid}>
                {profile?.addresses?.map(addr => (
                  <div key={addr.id} className={styles.addressCard}>
                    {addr.isDefault && <span className={styles.defaultBadge}>Default</span>}
                    <p className={styles.addressName}>{addr.fullName}</p>
                    <p className={styles.addressText}>{addr.street}</p>
                    <p className={styles.addressText}>{addr.city}, {addr.state} {addr.zipCode}</p>
                    <p className={styles.addressText}>{addr.phone}</p>
                  </div>
                ))}
                {(!profile?.addresses || profile.addresses.length === 0) && (
                  <p className="text-muted">No saved addresses</p>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Account Info</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>Member Since</label>
                  <p>{new Date(profile?.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className={styles.infoItem}>
                  <label>Account Type</label>
                  <p>{profile?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
