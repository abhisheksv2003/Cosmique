'use client';

import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.subtitle}>Our Story</span>
          <h1>Defining the Future of <br /><span>Conscious Beauty</span></h1>
          <p className={styles.heroText}>
            Cosmique was born out of a simple realization: the beauty industry needed more transparency and less mystery. 
            We started with a mission to deconstruct skincare, making high-performance actives accessible to everyone 
            while maintaining the highest standards of safety and science.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophy}>
        <div className={styles.container}>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyContent}>
              <h2 className={styles.sectionTitle}>The Cosmique Philosophy</h2>
              <p>
                We believe that skincare should be backed by clinical research, not marketing fluff. 
                Our team of dermatologists and scientists work tirelessly to formulate products 
                that deliver real, visible results without irritating the skin's natural barrier.
              </p>
              <div className={styles.stats}>
                <div className={styles.statItem}>
                  <h3>100%</h3>
                  <p>Science Backed</p>
                </div>
                <div className={styles.statItem}>
                  <h3>50+</h3>
                  <p>Actives Used</p>
                </div>
                <div className={styles.statItem}>
                  <h3>0%</h3>
                  <p>Harmful Toxins</p>
                </div>
              </div>
            </div>
            <div className={styles.philosophyImage}>
              <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800" alt="Laboratory" />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <div className={styles.container}>
          <h2 className={`${styles.sectionTitle} text-center`}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🧪</div>
              <h3>Transparency</h3>
              <p>We believe you have the right to know exactly what goes on your skin. We list every single ingredient and its concentration.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🐰</div>
              <h3>Cruelty-Free</h3>
              <p>Nature is our inspiration, and we protect it. None of our products or ingredients are ever tested on animals.</p>
            </div>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🌍</div>
              <h3>Sustainability</h3>
              <p>From eco-friendly packaging to ethically sourced ingredients, we are committed to reducing our environmental footprint.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team/Brand Section */}
      <section className={styles.brandSection}>
        <div className={styles.container}>
          <div className={styles.brandContent}>
            <h2>Join the Cosmique Community</h2>
            <p>
              Beautiful skin is a journey, and we're here to walk it with you. 
              Discover the routine that works for your unique skin needs.
            </p>
            <div className={styles.cta}>
              <a href="/products" className="btn btn-primary btn-lg">Shop the Collection</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
