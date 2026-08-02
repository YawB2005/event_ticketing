"use client";

import styles from './OrganizerSidebar.module.css';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  LayoutDashboard, 
  Ticket, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';

export default function OrganizerSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { showConfirm } = useAlert();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    showConfirm({
      title: "Log Out of Eventix",
      message: "Are you sure you want to log out of your Event Host account?",
      confirmText: "Yes, Log Out",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
      }
    });
  };

  return (
    <div className={styles.sidebar}>
      <Link href="/" className={styles.brandLogo}>Eventix</Link>
      
      <div className={styles.sidebarNav}>
        <Link href="/organizer" className={`${styles.navItem} ${pathname === '/organizer' ? styles.active : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link href="/organizer/events" className={`${styles.navItem} ${pathname.startsWith('/organizer/events') ? styles.active : ''}`}>
          <Ticket size={20} /> Events
        </Link>
        <Link href="/organizer/settings" className={`${styles.navItem} ${pathname.startsWith('/organizer/settings') ? styles.active : ''}`}>
          <Settings size={20} /> Settings
        </Link>
      </div>

      <div className={styles.sidebarBottom}>
        <a href="#" onClick={handleLogoutClick} className={styles.navItem}>
          <LogOut size={20} /> Log Out
        </a>
      </div>
    </div>
  );
}
