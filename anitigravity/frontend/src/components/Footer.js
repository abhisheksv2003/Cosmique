'use client';

import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Brand */}
            <div className={styles.brand}>
              <Link href="/" className={styles.logo}>
                <span>💎</span>
                <span className={styles.logoText}>GlamCart</span>
              </Link>
              <p className={styles.brandDesc}>
                Your destination for premium beauty & cosmetics. 
                Discover the best in skincare, makeup, haircare, and fragrances.
              </p>
              <div className={styles.socials}>
                <a href="#" className={styles.socialLink} aria-label="Instagram">📸</a>
                <a href="#" className={styles.socialLink} aria-label="Facebook">📘</a>
                <a href="#" className={styles.socialLink} aria-label="Twitter">🐦</a>
                <a href="#" className={styles.socialLink} aria-label="YouTube">🎬</a>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Quick Links</h4>
              <ul className={styles.links}>
                <li><Link href="/products">All Products</Link></li>
                <li><Link href="/products?category=skincare">Skincare</Link></li>
                <li><Link href="/products?category=makeup">Makeup</Link></li>
                <li><Link href="/products?category=hair-care">Hair Care</Link></li>
                <li><Link href="/products?category=fragrances">Fragrances</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Account</h4>
              <ul className={styles.links}>
                <li><Link href="/profile">My Profile</Link></li>
                <li><Link href="/orders">My Orders</Link></li>
                <li><Link href="/wishlist">Wishlist</Link></li>
                <li><Link href="/cart">Shopping Cart</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className={styles.column}>
              <h4 className={styles.columnTitle}>Stay Connected</h4>
              <p className={styles.newsletterText}>
                Subscribe for exclusive deals and beauty tips.
              </p>
              <form className={styles.newsletter} onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Your email address" className={styles.newsletterInput} />
                <button type="submit" className={styles.newsletterBtn}>→</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p>© 2026 GlamCart. All rights reserved. Made with 💕</p>
          <div className={styles.bottomLinks}>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
