"use client";

import { use, useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './Checkout.module.css';

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

  useEffect(() => {
    async function initCheckout() {
      const supabase = createClient();
      
      // 1. Check Authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Force login
        const currentUrl = `/checkout/${eventId}?tickets=${tickEventixaram || ''}`;
        router.push(`/login?next=${encodeURIComponent(currentUrl)}`);
        return;
      }
      setUser(user);

      // Fetch profile for phone check
      const profileRes = await fetch('/api/profile');
      if (profileRes.ok) {
        const { profile: userProfile } = await profileRes.json();
        setProfile(userProfile);
        if (!userProfile?.phone_number) {
          setNeedsPhone(true);
        }
      }

      // 2. Parse tickets
      if (!tickEventixaram) {
        setError('No tickets selected.');
        setLoading(false);
        return;
      }

      const requestedTiers = tickEventixaram.split(',').map(pair => {
        const [id, qty] = pair.split(':');
        return { id, qty: parseInt(qty, 10) };
      });

      // 3. Fetch event & ticket details to compute price
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) throw new Error('Event not found');
        const data = await res.json();
        setEventData(data);

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
      // Create payload format for API
      const ticketPayload = {};
      parsedTickets.forEach(t => {
        ticketPayload[t.id] = t.qty;
      });

      // Update phone number if needed
      if (needsPhone) {
        if (!phoneNumber || phoneNumber.length < 10) {
          throw new Error('Please enter a valid phone number for SMS ticket delivery.');
        }
        const profileUpdateRes = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone_number: phoneNumber })
        });
        if (!profileUpdateRes.ok) {
          throw new Error('Failed to save phone number');
        }
      }

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
    return <LoadingSpinner text="Loading checkout..." />;
  }

  if (error && !parsedTickets.length) {
    return (
      <div className={styles.page}>
        <div className={`container ${styles.checkoutContainer}`}>
          <div className={styles.error}>{error}</div>
          <button className="btn btn-secondary" onClick={() => router.push(`/events/${eventId}`)}>Go Back</button>
        </div>
      </div>
    );
  }

  const totalAmount = parsedTickets.reduce((acc, t) => acc + (t.price * t.qty), 0);

  return (
    <div className={styles.page}>
      <div className={`container ${styles.checkoutContainer}`}>
        <h1 className={styles.title}>Review Your Order</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>Event</h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>{eventData?.title}</p>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>{eventData?.venue_name}</p>
        </div>

        <div className={styles.glassCard}>
          <h2 className={styles.sectionTitle}>Order Summary</h2>
          {parsedTickets.map(t => (
            <div key={t.id} className={styles.summaryRow}>
              <span>{t.qty}x {t.name}</span>
              <span>GH₵ {(t.price * t.qty).toLocaleString()}</span>
            </div>
          ))}

          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>GH₵ {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {needsPhone && (
          <div className={styles.glassCard}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>We need your phone number to send your ticket codes via SMS.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="phone" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. 0241234567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  padding: '0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '1rem',
                  width: '100%',
                  backgroundColor: '#f8fafc'
                }}
                required
              />
            </div>
          </div>
        )}

        <button 
          className={`btn btn-primary ${styles.payBtn}`}
          onClick={handlePayment}
          disabled={isCheckingOut || totalAmount === 0} 
        >
          {isCheckingOut ? 'Processing...' : `Pay GH₵ ${totalAmount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage({ params }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={<LoadingSpinner text="Loading..." />}>
      <CheckoutContent eventId={id} />
    </Suspense>
  );
}
