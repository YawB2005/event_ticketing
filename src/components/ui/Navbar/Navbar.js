"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const AUTH_PATHS = ['/login', '/signup', '/forgot-password', '/reset-password'];

export default function Navbar() {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const isDashboard = pathname.startsWith('/home') || pathname.startsWith('/organizer');

  // Completely hide the Navbar on dashboard views to maintain the app aesthetic
  if (isDashboard) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          ETSP
        </Link>
        {!isAuthPage && (
          <div className={styles.navLinks}>
            <Link href="/events" className={styles.navLink}>Events</Link>
            <Link href="/about" className={styles.navLink}>About</Link>
            <Link href="/contact" className={styles.navLink}>Contact</Link>
          </div>
        )}
        {!isAuthPage && (
          <div className={styles.authActions}>
            <Link href="/login" className="btn btn-outline">Log In</Link>
            <Link href="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
