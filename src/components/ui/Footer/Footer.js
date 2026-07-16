"use client";

import styles from './Footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/home') || pathname.startsWith('/organizer');

  // Completely hide the Footer on dashboard views
  if (isDashboard) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.brandCol}>
          <div className={styles.logo}>ETSP</div>
          <p className={styles.description}>
            The premium platform for discovering, managing, and experiencing world-class events.
          </p>
        </div>
        <div className={styles.linksCol}>
          <h3>Explore</h3>
          <Link href="/events">Upcoming Events</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/venues">Venues</Link>
        </div>
        <div className={styles.linksCol}>
          <h3>Organize</h3>
          <Link href="/create">Create Event</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/organizer">Dashboard</Link>
        </div>
        <div className={styles.linksCol}>
          <h3>Legal</h3>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
      <div className={styles.copyright}>
        <div className="container">
          &copy; {new Date().getFullYear()} ETSP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
