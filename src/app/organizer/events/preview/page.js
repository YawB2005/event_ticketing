"use client";

import Link from 'next/link';
import { Calendar, MapPin, Tag, Eye, ArrowLeft, Ticket } from 'lucide-react';
import styles from './PreviewEvent.module.css';

export default function PreviewEventPage() {
  return (
    <div className={styles.page}>
      <div className={styles.previewBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Eye size={20} />
          <span>You are viewing a PREVIEW of how attendees will see your event.</span>
        </div>
        <Link href="/organizer/events" className={styles.backLink}>
          Back to Dashboard
        </Link>
      </div>

      <div 
        className={styles.heroCard}
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop')` }}
      >
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.categoryTag}>Music & Concerts</span>
          <h1 className={styles.title}>Neon Nights Festival 2026</h1>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <Calendar size={18} /> Aug 15, 2026 • 6:00 PM
            </div>
            <div className={styles.metaItem}>
              <MapPin size={18} /> Independence Square, Accra
            </div>
          </div>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        <div>
          <div className={styles.section}>
            <h2>About This Event</h2>
            <p className={styles.description}>
              Get ready for Accra's biggest electronic and afrobeat night! Featuring live performances by top regional and international DJs, immersive neon light shows, gourmet food pop-ups, and an unforgettable party atmosphere.
            </p>
          </div>

          <div className={styles.section}>
            <h2>Organizer Information</h2>
            <p style={{ color: '#cbd5e1', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Neon Wave Productions</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Verified Organizer • 12 Hosted Events</p>
          </div>
        </div>

        <div>
          <div className={styles.section}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Ticket size={22} style={{ color: '#38bdf8' }} /> Select Tickets
            </h2>

            <div className={styles.ticketCard}>
              <div>
                <div className={styles.ticketName}>General Admission</div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Standard Entry</span>
              </div>
              <div className={styles.ticketPrice}>GH₵ 80</div>
            </div>

            <div className={styles.ticketCard}>
              <div>
                <div className={styles.ticketName}>VIP Pass</div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Frontstage + Lounge</span>
              </div>
              <div className={styles.ticketPrice}>GH₵ 200</div>
            </div>

            <button className={styles.buyBtn} onClick={() => alert("This is a preview mode. Ticket purchasing is disabled in preview.")}>
              Get Tickets Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
