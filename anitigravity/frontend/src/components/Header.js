'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AppContext';
import { useCart } from '@/context/AppContext';
import { cartAPI } from '@/lib/api';
import styles from './Header.module.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items, setCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      cartAPI.getCart().then(res => setCart(res.data)).catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const cartCount = items?.length || 0;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <span>✨ Free shipping on orders above ₹499 | Use code WELCOME10 for 10% off</span>
          <div className={styles.topBarLinks}>
            <Link href="/products">Shop</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.headerContent}>
          {/* Mobile Menu Button */}
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive : ''}`}></span>
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive : ''}`}></span>
            <span className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive : ''}`}></span>
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>💎</span>
            <span className={styles.logoText}>GlamCart</span>
          </Link>

          {/* Navigation */}
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link href="/products" className={styles.navLink} onClick={() => setMenuOpen(false)}>All Products</Link>
            <Link href="/products?category=skincare" className={styles.navLink} onClick={() => setMenuOpen(false)}>Skincare</Link>
            <Link href="/products?category=makeup" className={styles.navLink} onClick={() => setMenuOpen(false)}>Makeup</Link>
            <Link href="/products?category=hair-care" className={styles.navLink} onClick={() => setMenuOpen(false)}>Hair Care</Link>
            <Link href="/products?category=fragrances" className={styles.navLink} onClick={() => setMenuOpen(false)}>Fragrances</Link>
          </nav>

          {/* Search */}
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            {isAuthenticated ? (
              <>
                <Link href="/wishlist" className={styles.actionBtn} title="Wishlist">
                  <span>♥</span>
                </Link>
                <Link href="/cart" className={styles.actionBtn} title="Cart">
                  <span>🛒</span>
                  {cartCount > 0 && (
                    <span className={styles.cartBadge}>{cartCount}</span>
                  )}
                </Link>
                <div className={styles.profileWrapper} ref={profileRef}>
                  <button
                    className={styles.profileBtn}
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <span className={styles.avatar}>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </button>
                  {profileOpen && (
                    <div className={styles.dropdown}>
                      <div className={styles.dropdownHeader}>
                        <p className={styles.dropdownName}>{user?.firstName} {user?.lastName}</p>
                        <p className={styles.dropdownEmail}>{user?.email}</p>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <Link href="/profile" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        👤 My Profile
                      </Link>
                      <Link href="/orders" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        📦 My Orders
                      </Link>
                      <Link href="/wishlist" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        ♥ Wishlist
                      </Link>
                      {user?.role === 'ADMIN' && (
                        <Link href="/admin" className={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <div className={styles.dropdownDivider}></div>
                      <button
                        className={styles.dropdownItem}
                        onClick={() => { logout(); setProfileOpen(false); }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={styles.authLinks}>
                <Link href="/login" className={`btn btn-outline btn-sm`}>Login</Link>
                <Link href="/register" className={`btn btn-primary btn-sm`}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
