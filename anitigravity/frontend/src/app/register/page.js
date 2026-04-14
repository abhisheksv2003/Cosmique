'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AppContext';
import { authAPI } from '@/lib/api';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.register(formData);
      login(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.details?.[0]?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.authOverlay}></div>
        <div className={styles.authBrandContent}>
          <h2>Join GlamCart</h2>
          <p>Create your account and discover premium beauty products curated just for you.</p>
        </div>
      </div>
      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>💎 GlamCart</Link>
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className={styles.nameRow}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input type="text" name="firstName" className="form-input" placeholder="First name" value={formData.firstName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input type="text" name="lastName" className="form-input" placeholder="Last name" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone (Optional)</label>
              <input type="tel" name="phone" className="form-input" placeholder="+91 9876543210" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="Min. 8 characters" value={formData.password} onChange={handleChange} required minLength={8} />
              <span className="text-xs text-muted">Must contain uppercase, lowercase, and a number</span>
            </div>
            <button type="submit" className={`btn btn-primary w-full ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className={styles.authSwitch}>
            Already have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
