"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Ticket, 
  ShoppingBag, 
  User, 
  Settings, 
  Globe, 
  LogOut 
} from 'lucide-react';
import styles from './AttendeeSidebar.module.css';

export default function AttendeeSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brandLogo}>
        ETSP
      </Link>

      <nav className={styles.sidebarNav}>
        <Link 
          href="/dashboard" 
          className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link 
          href="/dashboard/tickets" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/tickets') ? styles.active : ''}`}
        >
          <Ticket size={20} /> My Tickets
        </Link>
        <Link 
          href="/dashboard/orders" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/orders') ? styles.active : ''}`}
        >
          <ShoppingBag size={20} /> Purchase History
        </Link>
        <Link 
          href="/dashboard/profile" 
          className={`${styles.navItem} ${pathname === '/dashboard/profile' ? styles.active : ''}`}
        >
          <User size={20} /> My Profile
        </Link>
        <Link 
          href="/dashboard/settings" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/settings') ? styles.active : ''}`}
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>

      <div className={styles.sidebarBottom}>
        <Link href="/events" className={styles.navItem}>
          <Globe size={20} /> Explore Events
        </Link>
        <Link href="/" className={styles.navItem}>
          <LogOut size={20} /> Log Out
        </Link>
      </div>
    </aside>
  );
}
