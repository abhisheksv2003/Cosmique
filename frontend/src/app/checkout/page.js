'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AppContext';
import { useCart } from '@/context/AppContext';
import { cartAPI, authAPI, orderAPI } from '@/lib/api';
import styles from './checkout.module.css';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { user, isAuthenticated } = useAuth();
  const { items, summary, setCart, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [newAddress, setNewAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [cartRes, addrRes] = await Promise.all([
        cartAPI.getCart(),
        authAPI.getAddresses()
      ]);
      setCart(cartRes.data);
      setAddresses(addrRes.data.addresses || []);
      const defaultAddr = addrRes.data.addresses?.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    } catch { } finally { setLoading(false); }
  };

  const handleAddAddress = async () => {
    try {
      const { data } = await authAPI.addAddress({ ...addressForm, isDefault: addresses.length === 0 });
      setAddresses([...addresses, data.address]);
      setSelectedAddress(data.address.id);
      setNewAddress(false);
      setAddressForm({ fullName: '', phone: '', street: '', city: '', state: '', zipCode: '' });
      toast.success('Address added successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
    setPlacing(true);
    try {
      const { data } = await orderAPI.createOrder({
        addressId: selectedAddress,
        paymentMethod
      });
      clearCart();
      setOrderSuccess(data.order);
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔒</div>
        <h3>Please sign in to checkout</h3>
        <Link href="/login" className="btn btn-primary">Sign In</Link>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className={styles.successPage}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1>Order Placed Successfully!</h1>
          <p className={styles.successOrderNum}>Order #{orderSuccess.orderNumber}</p>
          <p className={styles.successText}>Thank you for your order. We&apos;ll send you updates on your order status.</p>
          <div className={styles.successDetails}>
            <div>
              <span>Total Amount</span>
              <strong>₹{parseFloat(orderSuccess.total).toLocaleString()}</strong>
            </div>
            <div>
              <span>Payment Method</span>
              <strong>{orderSuccess.paymentMethod || 'COD'}</strong>
            </div>
          </div>
          <div className={styles.successActions}>
            <Link href="/orders" className="btn btn-primary">View Orders</Link>
            <Link href="/products" className="btn btn-outline">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className={styles.loading}>Loading checkout...</div>;

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1>Checkout</h1>
        <div className={styles.layout}>
          {/* Left - Address & Payment */}
          <div className={styles.leftSection}>
            {/* Shipping Address */}
            <div className={styles.section}>
              <h2>📍 Shipping Address</h2>
              <div className={styles.addressList}>
                {addresses.map(addr => (
                  <label key={addr.id} className={`${styles.addressOption} ${selectedAddress === addr.id ? styles.addressSelected : ''}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id} onChange={() => setSelectedAddress(addr.id)} />
                    <div>
                      <p className={styles.addrName}>{addr.fullName}</p>
                      <p className={styles.addrText}>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                      <p className={styles.addrText}>{addr.phone}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button className="btn btn-outline btn-sm mt-md" onClick={() => setNewAddress(!newAddress)}>
                {newAddress ? 'Cancel' : '+ Add New Address'}
              </button>
              {newAddress && (
                <div className={styles.newAddressForm}>
                  <div className={styles.formRow}>
                    <input className="form-input" placeholder="Full Name" value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} />
                    <input className="form-input" placeholder="Phone" value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} />
                  </div>
                  <input className="form-input" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({ ...addressForm, street: e.target.value })} style={{ marginTop: '0.75rem' }} />
                  <div className={styles.formRow} style={{ marginTop: '0.75rem' }}>
                    <input className="form-input" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} />
                    <input className="form-input" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} />
                    <input className="form-input" placeholder="ZIP Code" value={addressForm.zipCode} onChange={e => setAddressForm({ ...addressForm, zipCode: e.target.value })} />
                  </div>
                  <button className="btn btn-primary btn-sm mt-md" onClick={handleAddAddress}>Save Address</button>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className={styles.section}>
              <h2>💳 Payment Method</h2>
              <div className={styles.paymentOptions}>
                <label className={`${styles.paymentOption} ${paymentMethod === 'COD' ? styles.paymentSelected : ''}`}>
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div>
                    <span className={styles.paymentName}>💵 Cash on Delivery</span>
                    <span className={styles.paymentDesc}>Pay when you receive your order</span>
                  </div>
                </label>
                <label className={`${styles.paymentOption} ${paymentMethod === 'STRIPE' ? styles.paymentSelected : ''}`}>
                  <input type="radio" name="payment" value="STRIPE" checked={paymentMethod === 'STRIPE'} onChange={() => setPaymentMethod('STRIPE')} />
                  <div>
                    <span className={styles.paymentName}>💳 Credit/Debit Card</span>
                    <span className={styles.paymentDesc}>Secure payment via Stripe</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className={styles.rightSection}>
            <div className={styles.summaryCard}>
              <h3>Order Summary</h3>
              <div className={styles.summaryItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img src={item.product.thumbnail || item.product.images?.[0] || ''} alt={item.product.name} />
                    <div>
                      <p className={styles.summaryItemName}>{item.product.name}</p>
                      <p className={styles.summaryItemQty}>Qty: {item.quantity}</p>
                    </div>
                    <span className={styles.summaryItemPrice}>₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{parseFloat(summary.subtotal).toLocaleString()}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{summary.shipping === 0 ? 'FREE' : `₹${summary.shipping}`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{(parseFloat(summary.subtotal) * 0.18).toFixed(2)}</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{(parseFloat(summary.subtotal) + summary.shipping + parseFloat(summary.subtotal) * 0.18).toFixed(2)}</span>
              </div>
              <button
                className={`btn btn-primary w-full ${styles.placeOrderBtn}`}
                onClick={handlePlaceOrder}
                disabled={placing || !selectedAddress}
              >
                {placing ? 'Placing Order...' : 'Place Order →'}
              </button>
              <p className={styles.secureNote}>🔒 Your payment information is secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
