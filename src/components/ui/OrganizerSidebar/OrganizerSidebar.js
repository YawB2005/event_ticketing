"use client";

import styles from './OrganizerSidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  Settings, 
  Globe,
  LogOut
} from 'lucide-react';

export default function OrganizerSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebar}>
      <Link href="/" className={styles.brandLogo}>ETSP</Link>
      
      <div className={styles.sidebarNav}>
        <Link href="/organizer" className={`${styles.navItem} ${pathname === '/organizer' ? styles.active : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/organizer/messages" className={`${styles.navItem} ${pathname.startsWith('/organizer/messages') ? styles.active : ''}`}>
          <MessageSquare size={20} /> Messages
        </Link>
        <Link href="/organizer/events" className={`${styles.navItem} ${pathname.startsWith('/organizer/events') ? styles.active : ''}`}>
          <Ticket size={20} /> Events
        </Link>
        <Link href="/organizer/settings" className={`${styles.navItem} ${pathname.startsWith('/organizer/settings') ? styles.active : ''}`}>
          <Settings size={20} /> Settings
        </Link>
      </div>

      <div className={styles.sidebarBottom}>
        <Link href="/" className={styles.navItem}>
          <Globe size={20} /> Go to Website
        </Link>
        <Link href="/" className={styles.navItem}>
          <LogOut size={20} /> Log Out
        </Link>
      </div>
    </div>
  );
}
