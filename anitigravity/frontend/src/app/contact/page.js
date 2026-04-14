+-'use client';

import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={styles.contactPage}>
      {/* Header */}
      <section className={styles.header}>
        <div className={styles.container}>
          <h1>Get in Touch</h1>
          <p>Have questions about our products or your routine? Our beauty experts are here to help.</p>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Contact Form */}
            <div className={styles.formSection}>
              {submitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>🎉</div>
                  <h2>Message Sent!</h2>
                  <p>Thank you for reaching out. Our team will get back to you within 24-48 hours.</p>
                  <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another Message</button>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <h2>Send us a Message</h2>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          className="form-input"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-input"
                          placeholder="hello@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <select
                        name="subject"
                        className="form-input"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a subject</option>
                        <option value="Product Inquiry">Product Inquiry</option>
                        <option value="Order Status">Order Status</option>
                        <option value="Skin Consultation">Skin Consultation</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-input"
                        rows="5"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-full">Send Message</button>
                  </form>
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className={styles.infoSection}>
              <div className={styles.infoGroup}>
                <h3>Our Office</h3>
                <p>123 Beauty Lane, Design District<br />Mumbai, MH 400001, India</p>
              </div>
              
              <div className={styles.infoGroup}>
                <h3>Contact Info</h3>
                <p>Email: care@cosmique.com</p>
                <p>Phone: +91 1800-COSMIQUE</p>
                <p>Mon-Sat: 10AM - 7PM IST</p>
              </div>

              <div className={styles.infoGroup}>
                <h3>Social Media</h3>
                <div className={styles.socialLinks}>
                  <a href="#">Instagram</a>
                  <a href="#">Twitter</a>
                  <a href="#">LinkedIn</a>
                </div>
              </div>

              <div className={styles.mapContainer}>
                {/* Styled Map Placeholder */}
                <div className={styles.mapPlaceholder}>
                  <span>📍 Map View coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <h2 className="text-center">Common Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h4>When will my order ship?</h4>
              <p>Orders are typically processed within 24 hours and shipped via express courier. Delivery takes 3-5 business days.</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Do you ship internationally?</h4>
              <p>Currently, we ship within India. We are working hard to bring Cosmique to the rest of the world soon!</p>
            </div>
            <div className={styles.faqItem}>
              <h4>Are the products safe for sensitive skin?</h4>
              <p>Yes! All our products are formulated to be skin-friendly. However, we always recommend a patch test first.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
