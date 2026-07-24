"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, Plus, Minus } from 'lucide-react';
import styles from './Checkout.module.css';

export default function CheckoutPage({ params }) {
  const router = useRouter();

  // State
  const [quantity, setQuantity] = useState(2);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' or 'momo'
  const [momoProvider, setMomoProvider] = useState('mtn'); // 'mtn', 'telecel', 'at'
  
  // Contact details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  // Event & Pricing calculations
  const unitPrice = 45.00;
  const bookingFeePerTicket = 2.75;
  const subtotal = quantity * unitPrice;
  const totalFees = quantity * bookingFeePerTicket;
  const grandTotal = subtotal + totalFees;

  const handlePay = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter your name and email address.");
      return;
    }

    // Pass checkout details to processing page
    const query = new URLSearchParams({
      id: params.id || '1',
      title: 'Neon Nights Music Festival 2026',
      qty: quantity.toString(),
      total: grandTotal.toFixed(2),
      provider: paymentMethod === 'momo' ? `Mobile Money (${momoProvider.toUpperCase()})` : 'Credit Card',
      email: email,
      name: name
    }).toString();

    router.push(`/checkout/processing?${query}`);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <Link href="/events/1" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '1rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Event Details
        </Link>
        <h1>Checkout</h1>
        <p>Complete your purchase to secure your tickets.</p>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Col: Payment Details */}
        <div className={styles.paymentCol}>
          <form onSubmit={handlePay}>
            {/* Contact Info Panel */}
            <div className={`glass-panel ${styles.panel}`}>
              <h2>Contact Information</h2>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input 
                  type="text" 
                  id="name"
                  placeholder="e.g. Ama Mensah" 
                  className={styles.input} 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email Address (for Ticket PDF & Receipt) *</label>
                <input 
                  type="email" 
                  id="email"
                  placeholder="name@example.com" 
                  className={styles.input} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number (SMS ticket updates)</label>
                <input 
                  type="tel" 
                  id="phone"
                  placeholder="+233 24 000 0000" 
                  className={styles.input} 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Payment Method Panel */}
            <div className={`glass-panel ${styles.panel}`}>
              <h2>Select Payment Method</h2>
              <div className={styles.paymentOptions}>
                <div 
                  className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.selected : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <CreditCard size={20} />
                  <span>Credit / Debit Card</span>
                </div>

                <div 
                  className={`${styles.paymentOption} ${paymentMethod === 'momo' ? styles.selected : ''}`}
                  onClick={() => setPaymentMethod('momo')}
                >
                  <Smartphone size={20} />
                  <span>Mobile Money</span>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className={styles.cardDetails}>
                  <div className={styles.formGroup}>
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4000 1234 5678 9010" 
                      className={styles.input} 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>
                  <div className={styles.rowGrid}>
                    <div className={styles.formGroup}>
                      <label>Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        placeholder="12/28" 
                        className={styles.input} 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>CVC</label>
                      <input 
                        type="text" 
                        placeholder="123" 
                        className={styles.input} 
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Money Inputs */}
              {paymentMethod === 'momo' && (
                <div className={styles.cardDetails}>
                  <div className={styles.formGroup}>
                    <label>Select Network Provider</label>
                    <select 
                      className={styles.input} 
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      style={{ background: '#0f172a' }}
                    >
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="telecel">Telecel Cash</option>
                      <option value="at">AT Money</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Mobile Money Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 024 123 4567" 
                      className={styles.input} 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className={`btn btn-primary ${styles.payBtn}`}>
              Pay GH₵ {grandTotal.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right Col: Order Summary */}
        <div className={styles.summaryCol}>
          <div className={`glass-panel ${styles.summaryPanel}`}>
            <h2>Order Summary</h2>
            <div className={styles.eventInfo}>
              <h3>Neon Nights Music Festival 2026</h3>
              <p>August 15, 2026 • 7:00 PM</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Labadi Beach Resort, Accra</p>
            </div>
            
            {/* Quantity Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>General Admission</span>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>GH₵ {unitPrice.toFixed(2)} each</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: '#1e293b', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '20px', textAlign: 'center' }}>{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: '#1e293b', border: 'none', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal ({quantity} {quantity === 1 ? 'ticket' : 'tickets'})</span>
                <span>GH₵ {subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Service & Tech Fee</span>
                <span>GH₵ {totalFees.toFixed(2)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total Amount</span>
                <span>GH₵ {grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 256-bit Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
