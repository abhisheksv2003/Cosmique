'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AppContext';
import { useCart } from '@/context/AppContext';
import { cartAPI } from '@/lib/api';
import styles from './Header.module.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items, setCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const profileRef = useRef(null);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      cartAPI.getCart().then(res => setCart(res.data)).catch(() => {});
    }
  }, [isAuthenticated, setCart]);

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
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push('/products');
    }
  };

  const cartCount = items?.length || 0;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarContent}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            ✨ Free shipping on orders above ₹499 | Use code WELCOME10 for 10% off
          </motion.span>
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
            <motion.span 
              whileHover={{ scale: 1.2, rotate: 10 }}
              className={styles.logoIcon}
            >
              💎
            </motion.span>
            <span className={styles.logoText}>Cosmique</span>
          </Link>

          {/* Navigation */}
          <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
            <Link href="/products" className={styles.navLink} onClick={() => setMenuOpen(false)}>All Products</Link>
            
            <div className={styles.navItem}>
              <span className={styles.navLink}>Shop by Concern</span>
              <div className={styles.megaMenu}>
                <div className={styles.megaMenuColumn}>
                  <h4>Skin Concerns</h4>
                  <div className={styles.megaMenuList}>
                    <Link href="/products?concern=acne" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🩹</span> Acne & Blemishes
                    </Link>
                    <Link href="/products?concern=aging" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>⌛</span> Anti-Aging
                    </Link>
                    <Link href="/products?concern=pigmentation" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>✨</span> Brightening & Pigmentation
                    </Link>
                    <Link href="/products?concern=dryness" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>💧</span> Dryness & Hydration
                    </Link>
                  </div>
                </div>
                <div className={styles.megaMenuColumn}>
                  <h4>Specialized Care</h4>
                  <div className={styles.megaMenuList}>
                    <Link href="/products?concern=oil-control" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🌿</span> Oil Control
                    </Link>
                    <Link href="/products?concern=sensitive" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🛡️</span> Sensitive Skin
                    </Link>
                    <Link href="/products?concern=sun-protection" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>☀️</span> Sun Protection
                    </Link>
                    <Link href="/products?concern=pores" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🕳️</span> Large Pores
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.navItem}>
              <span className={styles.navLink}>Shop by Ingredient</span>
              <div className={styles.megaMenu}>
                <div className={styles.megaMenuColumn}>
                  <h4>The Actives</h4>
                  <div className={styles.megaMenuList}>
                    <Link href="/products?ingredient=vitamin-c" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🍊</span> Vitamin C
                    </Link>
                    <Link href="/products?ingredient=niacinamide" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🧬</span> Niacinamide
                    </Link>
                    <Link href="/products?ingredient=hyaluronic-acid" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🌊</span> Hyaluronic Acid
                    </Link>
                    <Link href="/products?ingredient=retinol" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🌙</span> Retinol
                    </Link>
                  </div>
                </div>
                <div className={styles.megaMenuColumn}>
                  <h4>Natural Extracts</h4>
                  <div className={styles.megaMenuList}>
                    <Link href="/products?ingredient=salicylic-acid" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🧪</span> Salicylic Acid
                    </Link>
                    <Link href="/products?ingredient=tea-tree" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🍃</span> Tea Tree
                    </Link>
                    <Link href="/products?ingredient=aloe-vera" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🌵</span> Aloe Vera
                    </Link>
                    <Link href="/products?ingredient=ceramides" className={styles.megaMenuItem} onClick={() => setMenuOpen(false)}>
                      <span className={styles.megaMenuIcon}>🧱</span> Ceramides
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link href="/products?category=skincare" className={styles.navLink} onClick={() => setMenuOpen(false)}>Skincare</Link>
            <Link href="/products?category=makeup" className={styles.navLink} onClick={() => setMenuOpen(false)}>Makeup</Link>
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
                  <motion.span whileHover={{ scale: 1.2 }}>♥</motion.span>
                </Link>
                <Link href="/cart" className={styles.actionBtn} title="Cart">
                  <motion.span whileHover={{ scale: 1.2 }}>🛒</motion.span>
                  {cartCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={styles.cartBadge}
                    >
                      {cartCount}
                    </motion.span>
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
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={styles.dropdown}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
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
