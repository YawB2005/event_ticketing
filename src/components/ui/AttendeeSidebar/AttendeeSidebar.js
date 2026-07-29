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
  LogOut,
  X,
  Compass
} from 'lucide-react';
import styles from './AttendeeSidebar.module.css';

export default function AttendeeSidebar() {
  const pathname = usePathname();

  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('aside');
    if (sidebar && window.innerWidth <= 992) {
      sidebar.style.transform = 'translateX(-100%)';
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/" className={styles.brandLogo} style={{ marginBottom: 0 }} onClick={closeMobileSidebar}>
          ETSP
        </Link>
        <button 
          onClick={closeMobileSidebar}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          className={styles.closeBtn}
          aria-label="Close Sidebar"
        >
          <X size={22} />
        </button>
      </div>

      <nav className={styles.sidebarNav}>
        <Link 
          href="/dashboard" 
          className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link 
          href="/dashboard/events" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/events') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <Compass size={20} /> Browse Events
        </Link>
        <Link 
          href="/dashboard/tickets" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/tickets') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <Ticket size={20} /> My Tickets
        </Link>
        <Link 
          href="/dashboard/orders" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/orders') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <ShoppingBag size={20} /> Purchase History
        </Link>
        <Link 
          href="/dashboard/profile" 
          className={`${styles.navItem} ${pathname === '/dashboard/profile' ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <User size={20} /> My Profile
        </Link>
        <Link 
          href="/dashboard/settings" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/settings') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <Settings size={20} /> Settings
        </Link>
      </nav>

      <div className={styles.sidebarBottom}>
        <Link href="/events" className={styles.navItem} onClick={closeMobileSidebar}>
          <Globe size={20} /> Website Directory
        </Link>
        <Link href="/" className={styles.navItem} onClick={closeMobileSidebar}>
          <LogOut size={20} /> Log Out
        </Link>
      </div>
    </aside>
  );
}
