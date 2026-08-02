"use client";

import { use, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './Checkout.module.css';
import { CreditCard, Phone, ShieldCheck, Ticket, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

function CheckoutContent({ eventId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tickEventixaram = searchParams.get('tickets'); // e.g. "t1:2,t2:1"
  
  const [user, setUser] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [parsedTickets, setParsedTickets] = useState([]);
  const [profile, setProfile] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [needsPhone, setNeedsPhone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('momo');

  useEffect(() => {
    async function initCheckout() {
      const supabase = createClient();
      
      // 1. Check Authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Force login
        const currentUrl = `/checkout/${eventId}${tickEventixaram ? `?tickets=${tickEventixaram}` : ''}`;
        router.push(`/login?next=${encodeURIComponent(currentUrl)}`);
        return;
      }
      setUser(user);

      // Fetch profile for phone check
      try {
        const profileRes = await fetch('/api/profile');
        if (profileRes.ok) {
          const { profile: userProfile } = await profileRes.json();
          setProfile(userProfile);
          if (userProfile?.phone_number) {
            setPhoneNumber(userProfile.phone_number);
          } else {
            setNeedsPhone(true);
          }
        }
      } catch (e) {
        setNeedsPhone(true);
      }

      // 2. Determine tickets from query params OR sessionStorage draft
      let requestedTiers = [];

      if (tickEventixaram) {
        requestedTiers = tickEventixaram.split(',').map(pair => {
          const [id, qty] = pair.split(':');
          return { id, qty: parseInt(qty, 10) || 0 };
        }).filter(t => t.qty > 0);
      } else {
        // Fallback: check sessionStorage draft saved by EventDetail page
        const draftStr = sessionStorage.getItem(`checkout_draft_${eventId}`);
        if (draftStr) {
          try {
            const draft = JSON.parse(draftStr);
            if (draft.items && draft.items.length > 0) {
              requestedTiers = draft.items.map(i => ({ id: i.id, qty: i.quantity }));
            }
          } catch (e) {
            console.error('Failed to parse checkout draft', e);
          }
        }
      }

      // 3. Fetch event & ticket details to compute price
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEventData(data);

        // If no tickets requested, select first available tier as default
        if (requestedTiers.length === 0 && data.ticket_types && data.ticket_types.length > 0) {
          const firstTier = data.ticket_types[0];
          requestedTiers = [{ id: firstTier.id, qty: 1 }];
        }

        if (requestedTiers.length === 0) {
          throw new Error('No ticket tiers selected. Please return to event page to select tickets.');
        }

        const ticketsWithPrices = requestedTiers.map(req => {
          const tierInfo = (data.ticket_types || []).find(t => t.id === req.id);
          if (!tierInfo) throw new Error(`Invalid ticket tier selected (${req.id})`);
          
          return {
            id: req.id,
            name: tierInfo.name,
            qty: req.qty,
            price: parseFloat(tierInfo.price || 0)
          };
        });

        setParsedTickets(ticketsWithPrices);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load checkout details.');
      } finally {
        setLoading(false);
      }
    }

    initCheckout();
  }, [eventId, tickEventixaram, router]);

  const handlePayment = async () => {
    setIsCheckingOut(true);
    setError(null);
    try {
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error('Please enter a valid phone number (+233 / 024...) for SMS ticket delivery.');
      }

      // Save updated phone number to profile
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: phoneNumber })
      });

      // Create payload format for API
      const ticketPayload = {};
      parsedTickets.forEach(t => {
        ticketPayload[t.id] = t.qty;
      });

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          tickets: ticketPayload
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment');

      // Redirect to Paystack
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
      setIsCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoadingSpinner text="Securing your checkout session..." />
      </div>
    );
  }

  if (error && !parsedTickets.length) {
    return (
      <div className={styles.page}>
        <div className={styles.checkoutContainer}>
          <div className={styles.error}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
          <button className={styles.payBtn} onClick={() => router.push(`/events/${eventId}`)}>
            ← Return to Event Details
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = parsedTickets.reduce((acc, t) => acc + (t.price * t.qty), 0);

  return (
    <div className={styles.page}>
      <div className={styles.checkoutContainer}>
        
        <Link href={`/events/${eventId}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(252, 248, 242, 0.7)', textDecoration: 'none', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Back to Event Details
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Review & Checkout</h1>
          <p className={styles.subtitle}>Confirm your selected pass and complete payment via Paystack</p>
        </div>
        
        {error && (
          <div className={styles.error}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* EVENT SUMMARY CARD */}
        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>
            <Ticket size={20} color="#ff6b2c" /> Event Specifications
          </h2>
          <h3 className={styles.eventTitle}>{eventData?.title}</h3>
          <p className={styles.venueText}>
            {eventData?.venue_name || 'Main Event Venue'} • {eventData?.start_datetime ? new Date(eventData.start_datetime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
          </p>
        </div>

        {/* ORDER SUMMARY CARD */}
        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          {parsedTickets.map(t => (
            <div key={t.id} className={styles.summaryRow}>
              <span><strong>{t.qty}x</strong> {t.name}</span>
              <span>GH₵ {(t.price * t.qty).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          ))}

          <div className={styles.summaryTotal}>
            <span>Total Payable Amount</span>
            <span className={styles.totalPrice}>GH₵ {totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* CONTACT & DELIVERY INFO CARD */}
        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>
            <Phone size={20} color="#ff6b2c" /> SMS Ticket Delivery & Contact
          </h2>
          <p style={{ color: 'rgba(252, 248, 242, 0.7)', fontSize: '0.92rem', marginBottom: '1rem' }}>
            We'll instantly deliver your digital QR ticket pass code to this phone number via SMS upon successful payment.
          </p>
          <div>
            <label htmlFor="phone" style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff', display: 'block', marginBottom: '0.5rem' }}>
              Mobile Phone Number *
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="e.g. 0241234567 or +233241234567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={styles.inputField}
              required
            />
          </div>
        </div>

        {/* PAYMENT METHOD SELECTOR CARD */}
        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>
            <CreditCard size={20} color="#ff6b2c" /> Select Payment Method
          </h2>
          <div className={styles.paymentGrid}>
            <label className={`${styles.paymentOption} ${paymentMethod === 'momo' ? styles.paymentOptionSelected : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="momo" 
                checked={paymentMethod === 'momo'} 
                onChange={() => setPaymentMethod('momo')} 
              />
              <div>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>MTN Mobile Money</strong>
                <span style={{ fontSize: '0.8rem', color: 'rgba(252, 248, 242, 0.6)' }}>Instant MoMo Checkout</span>
              </div>
            </label>

            <label className={`${styles.paymentOption} ${paymentMethod === 'vodafone' ? styles.paymentOptionSelected : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="vodafone" 
                checked={paymentMethod === 'vodafone'} 
                onChange={() => setPaymentMethod('vodafone')} 
              />
              <div>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>Telecel / AirtelTigo</strong>
                <span style={{ fontSize: '0.8rem', color: 'rgba(252, 248, 242, 0.6)' }}>Mobile Money Wallet</span>
              </div>
            </label>

            <label className={`${styles.paymentOption} ${paymentMethod === 'card' ? styles.paymentOptionSelected : ''}`}>
              <input 
                type="radio" 
                name="payment" 
                value="card" 
                checked={paymentMethod === 'card'} 
                onChange={() => setPaymentMethod('card')} 
              />
              <div>
                <strong style={{ display: 'block', color: '#ffffff', fontSize: '0.95rem' }}>Visa / Mastercard</strong>
                <span style={{ fontSize: '0.8rem', color: 'rgba(252, 248, 242, 0.6)' }}>Debit or Credit Card</span>
              </div>
            </label>
          </div>
        </div>

        <button 
          className={styles.payBtn}
          onClick={handlePayment}
          disabled={isCheckingOut} 
        >
          {isCheckingOut ? 'Initializing Secure Payment...' : `Proceed to Pay GH₵ ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'rgba(252, 248, 242, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="#ffb703" /> 256-Bit SSL Encrypted & Secured by Paystack
        </p>

      </div>
    </div>
  );
}

export default function CheckoutPage({ params }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c0502' }}>
        <LoadingSpinner text="Loading Checkout..." />
      </div>
    }>
      <CheckoutContent eventId={id} />
    </Suspense>
  );
}
