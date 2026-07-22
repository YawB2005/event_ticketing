import Link from 'next/link';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import styles from './HomeNavbar.module.css';

export default function HomeNavbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        {/* Placeholder for Eventbrite-style logo */}
        ETSP
      </Link>

      <div className={styles.searchBar}>
        <div className={styles.searchSection}>
          <Search size={18} />
          <input type="text" placeholder="Search events" className={styles.searchInput} />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.searchSection}>
          <MapPin size={18} />
          <input type="text" placeholder="Your Location" className={styles.searchInput} />
        </div>
        <button className={styles.searchBtn}>
          <Search size={18} color="#fff" />
        </button>
      </div>

      <div className={styles.navLinks}>
        <Link href="/create" className={styles.navLink}>Create Events</Link>
        <div className={styles.navLink} style={{ cursor: 'pointer' }}>
          Help Center <ChevronDown size={14} style={{ marginTop: '2px' }} />
        </div>
        <Link href="/login" className={styles.navLink}>Sign in</Link>
      </div>
    </nav>
  );
}
