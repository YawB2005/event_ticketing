"use client";

import styles from './OrganizerSidebar.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Ticket, 
  FileText,
  User,
  Settings, 
  Globe,
  LogOut,
  X
} from 'lucide-react';

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const closeMobileSidebar = () => {
    const sidebar = document.querySelector('aside');
    if (sidebar && window.innerWidth <= 992) {
      sidebar.style.transform = 'translateX(-100%)';
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    closeMobileSidebar();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
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
      
      <div className={styles.sidebarNav}>
        <Link 
          href="/organizer" 
          className={`${styles.navItem} ${pathname === '/organizer' ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link 
          href="/organizer/events" 
          className={`${styles.navItem} ${pathname.startsWith('/organizer/events') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <Ticket size={20} /> Events
        </Link>
        <Link 
          href="/organizer/reports" 
          className={`${styles.navItem} ${pathname.startsWith('/organizer/reports') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <FileText size={20} /> Reports
        </Link>
        <Link 
          href="/organizer/messages" 
          className={`${styles.navItem} ${pathname.startsWith('/organizer/messages') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <MessageSquare size={20} /> Messages
        </Link>
        <Link 
          href="/organizer/profile" 
          className={`${styles.navItem} ${pathname === '/organizer/profile' ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <User size={20} /> Profile
        </Link>
        <Link 
          href="/organizer/settings" 
          className={`${styles.navItem} ${pathname.startsWith('/organizer/settings') ? styles.active : ''}`}
          onClick={closeMobileSidebar}
        >
          <Settings size={20} /> Settings
        </Link>
      </div>

      <div className={styles.sidebarBottom}>
        <Link href="/" className={styles.navItem} onClick={closeMobileSidebar}>
          <Globe size={20} /> Go to Website
        </Link>
        <a href="#" onClick={handleLogout} className={styles.navItem}>
          <LogOut size={20} /> Log Out
        </a>
      </div>
    </aside>
  );
}
