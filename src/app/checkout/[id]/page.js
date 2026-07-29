"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, Plus, Minus } from 'lucide-react';
import { getEventById, purchaseTicket } from '@/utils/eventStore';
import styles from './Checkout.module.css';

export default function CheckoutPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  const tierName = searchParams.get('tier') || 'General Admission';
  const queryPrice = parseFloat(searchParams.get('price')) || 50;

  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [momoProvider, setMomoProvider] = useState('mtn');

  const [name, setName] = useState('Kwame Mensah');
  const [email, setEmail] = useState('kwame@example.com');
  const [phone, setPhone] = useState('024 123 4567');

  useEffect(() => {
    setEvent(getEventById(eventId));
  }, [eventId]);

  const unitPrice = queryPrice;
  const bookingFeePerTicket = 2.50;
  const subtotal = quantity * unitPrice;
  const totalFees = quantity * bookingFeePerTicket;
  const grandTotal = subtotal + totalFees;

  const handlePay = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert("Please enter your name and email address.");
      return;
    }

    const { ticket, order } = purchaseTicket({
      eventId,
      tierName,
      price: grandTotal,
      paymentMethod: paymentMethod === 'momo' ? `MTN Mobile Money (${momoProvider.toUpperCase()})` : 'Credit Card',
      attendeeName: name,
      attendeeEmail: email
    });

    const query = new URLSearchParams({
      id: eventId,
      ticketId: ticket.id,
      orderId: order.id,
      title: event?.title || 'Event Pass',
      total: grandTotal.toFixed(2),
      email: email,
      name: name
    }).toString();

    router.push(`/checkout/processing?${query}`);
  };

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <Link href={`/events/${eventId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Event Details
        </Link>
        <h1>Checkout</h1>
        <p>Complete your purchase to secure your event tickets.</p>
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

              {/* Mobile Money Inputs */}
              {paymentMethod === 'momo' && (
                <div className={styles.cardDetails}>
                  <div className={styles.formGroup}>
                    <label>Select Network Provider</label>
                    <select 
                      className={styles.input} 
                      value={momoProvider}
                      onChange={(e) => setMomoProvider(e.target.value)}
                      style={{ background: '#f8fafc', color: '#0f172a' }}
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
              <h3>{event?.title || 'Neon Nights Music Festival 2026'}</h3>
              <p>{event?.date || 'Aug 15, 2026'} • {event?.time || '8:00 PM'}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>{event?.venue || 'Accra Venue'}</p>
            </div>
            
            {/* Quantity Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block', color: '#0f172a' }}>{tierName}</span>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>GH₵ {unitPrice.toFixed(2)} each</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button 
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', minWidth: '20px', textAlign: 'center', color: '#0f172a' }}>{quantity}</span>
                <button 
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', color: '#0f172a', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 256-bit Encrypted Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
