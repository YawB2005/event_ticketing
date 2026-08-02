"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/app/organizer/events/[id]/scan/Scanner.module.css';
import { QrCode, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import Link from 'next/link';

export default function ScanPortalPage() {
  const router = useRouter();
  const [eventScanLink, setEventScanLink] = useState('');

  const handleStartScan = (e) => {
    e.preventDefault();
    if (!eventScanLink) return;

    // Check if input is full URL or token/path
    try {
      if (eventScanLink.includes('/scan/')) {
        const url = new URL(eventScanLink);
        router.push(`${url.pathname}${url.search}`);
      } else {
        router.push(`/scan/${eventScanLink}`);
      }
    } catch (e) {
      router.push(`/scan/${eventScanLink}`);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.scannerWrapper}>
        <div className={styles.header}>
          <div style={{ width: '70px', height: '70px', background: 'rgba(255, 107, 44, 0.15)', border: '1px solid rgba(255, 107, 44, 0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff6b2c', margin: '0 auto 1.5rem' }}>
            <QrCode size={36} />
          </div>
          <h1>Gatekeeper Scanning Portal</h1>
          <p className={styles.subText}>Enter your event scan access link or token provided by the organizer.</p>
        </div>

        <div className={styles.scannerContainer} style={{ maxWidth: '560px', margin: '0 auto' }}>
          <form onSubmit={handleStartScan} className={styles.manualEntry}>
            <div style={{ width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', color: '#ffffff', textAlign: 'left' }}>
                Event Scan Link or Security Token *
              </label>
              <input 
                type="text" 
                placeholder="e.g. Paste full scan link from organizer..." 
                value={eventScanLink}
                onChange={(e) => setEventScanLink(e.target.value)}
                className={styles.manualInput}
                style={{ width: '100%', maxWidth: '100%' }}
                required
              />
            </div>

            <button type="submit" className={styles.scanAgainBtn} style={{ width: '100%', marginTop: '1rem' }} disabled={!eventScanLink}>
              Launch Ticket Scanner <ArrowRight size={18} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'text-bottom' }} />
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <p style={{ color: 'rgba(252, 248, 242, 0.6)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Are you an event organizer looking for your scanner links?
          </p>
          <Link href="/organizer/events" className={styles.verifyBtn} style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={16} /> Go to Organizer Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
