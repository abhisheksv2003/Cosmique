'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AppContext';
import { authAPI } from '@/lib/api';
import styles from './auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      login(data.user, data.accessToken, data.refreshToken);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.authOverlay}></div>
        <div className={styles.authBrandContent}>
          <h2>Welcome Back!</h2>
          <p>Sign in to access your account, track orders, and enjoy exclusive offers.</p>
        </div>
      </div>
      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <div className={styles.authHeader}>
            <Link href="/" className={styles.authLogo}>💎 Cosmique</Link>
            <h1>Sign In</h1>
            <p>Enter your credentials to continue</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={`btn btn-primary w-full ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.authDivider}>
            <span>or</span>
          </div>

          <div className={styles.demoCredentials}>
            <p className="text-sm text-muted">Demo Credentials:</p>
            <div className={styles.demoGrid}>
              <button 
                className={styles.demoBtn}
                onClick={() => { setEmail('admin@cosmique.com'); setPassword('Admin@123'); }}
              >
                👑 Admin Login
              </button>
              <button 
                className={styles.demoBtn}
                onClick={() => { setEmail('customer@test.com'); setPassword('Customer@123'); }}
              >
                👤 Customer Login
              </button>
            </div>
          </div>

          <p className={styles.authSwitch}>
            Don&apos;t have an account? <Link href="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
