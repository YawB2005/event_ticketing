"use client";

import { use, useState, useEffect } from 'react';
import styles from './EventDetail.module.css';
import Link from 'next/link';
import { getEventById } from '@/utils/eventStore';

export default function EventDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [selectedTier, setSelectedTier] = useState(null);

  useEffect(() => {
    const fetched = getEventById(eventId);
    setEvent(fetched);
    if (fetched && fetched.tiers && fetched.tiers.length > 0) {
      setSelectedTier(fetched.tiers[0]);
    }
  }, [eventId]);

  if (!event) {
    return <div style={{ padding: '4rem', textContent: 'center' }}>Loading event details...</div>;
  }

  const price = selectedTier ? selectedTier.price : 0;

  return (
    <div className={styles.page}>
      {/* Event Header Hero */}
      <div className={styles.hero} style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.categoryBadge}>{event.category}</span>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.subtitle}>{event.date} &bull; {event.venue}</p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainGrid}`}>
        {/* Left Column: Details */}
        <div className={styles.detailsCol}>
          <section className={styles.section}>
            <h2>About this Event</h2>
            <p className={styles.description}>{event.description}</p>
          </section>

          <section className={styles.section}>
            <h2>When & Where</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <h3>Date & Time</h3>
                <p>{event.date}</p>
                <p>{event.time}</p>
              </div>
              <div className={styles.infoItem}>
                <h3>Location</h3>
                <p>{event.venue}</p>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2>Organizer</h2>
            <div className={styles.organizerCard}>
              <div className={styles.organizerAvatar}>ET</div>
              <div>
                <h3>Official ETSP Host</h3>
                <p>Verified Verified Event Host</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Ticket Selection */}
        <div className={styles.ticketCol}>
          <div className={`glass-panel ${styles.ticketCard}`}>
            <h2>Select Ticket Tier</h2>
            <div className={styles.ticketList}>
              {(event.tiers || []).map(tier => (
                <div 
                  key={tier.id} 
                  className={`${styles.ticketType} ${selectedTier?.id === tier.id ? styles.activeTier : ''}`}
                  onClick={() => setSelectedTier(tier)}
                  style={{ cursor: 'pointer', padding: '1rem', border: selectedTier?.id === tier.id ? '2px solid #2563eb' : '1px solid #e2e8f0', borderRadius: '14px', marginBottom: '0.75rem' }}
                >
                  <div className={styles.ticketInfo}>
                    <h4 style={{ margin: 0, color: '#0f172a' }}>{tier.name}</h4>
                    <p className={styles.ticketPrice} style={{ fontWeight: 700, color: '#2563eb', margin: '0.25rem 0' }}>
                      {tier.price === 0 ? 'Free Entry' : `GH₵ ${tier.price}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.checkoutSection}>
              <div className={styles.totalRow}>
                <span>Total Amount</span>
                <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#059669' }}>GH₵ {price}.00</span>
              </div>
              <Link 
                href={`/checkout/${event.id}?tier=${encodeURIComponent(selectedTier?.name || 'Standard')}&price=${price}`} 
                className={`btn btn-primary ${styles.checkoutBtn}`}
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', background: '#2563eb', color: 'white', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, marginTop: '1rem' }}
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
