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
  LogOut
} from 'lucide-react';

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className={styles.sidebar}>
      <Link href="/" className={styles.brandLogo}>ETSP</Link>
      
      <div className={styles.sidebarNav}>
        <Link href="/organizer" className={`${styles.navItem} ${pathname === '/organizer' ? styles.active : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/organizer/events" className={`${styles.navItem} ${pathname.startsWith('/organizer/events') ? styles.active : ''}`}>
          <Ticket size={20} /> Events
        </Link>
        <Link href="/organizer/reports" className={`${styles.navItem} ${pathname.startsWith('/organizer/reports') ? styles.active : ''}`}>
          <FileText size={20} /> Reports
        </Link>
        <Link href="/organizer/messages" className={`${styles.navItem} ${pathname.startsWith('/organizer/messages') ? styles.active : ''}`}>
          <MessageSquare size={20} /> Messages
        </Link>
        <Link href="/organizer/profile" className={`${styles.navItem} ${pathname === '/organizer/profile' ? styles.active : ''}`}>
          <User size={20} /> Profile
        </Link>
        <Link href="/organizer/settings" className={`${styles.navItem} ${pathname.startsWith('/organizer/settings') ? styles.active : ''}`}>
          <Settings size={20} /> Settings
        </Link>
      </div>

      <div className={styles.sidebarBottom}>
        <Link href="/" className={styles.navItem}>
          <Globe size={20} /> Go to Website
        </Link>
        <a href="#" onClick={handleLogout} className={styles.navItem}>
          <LogOut size={20} /> Log Out
        </a>
      </div>
    </div>
  );
}
