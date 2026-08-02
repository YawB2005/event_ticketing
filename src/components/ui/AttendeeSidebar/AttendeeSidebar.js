"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  LayoutDashboard, 
  Ticket, 
  ShoppingBag, 
  User, 
  LogOut 
} from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
import styles from './AttendeeSidebar.module.css';

export default function AttendeeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { showConfirm } = useAlert();

  const handleLogoutClick = (e) => {
    e.preventDefault();
    showConfirm({
      title: "Log Out of Eventix",
      message: "Are you sure you want to log out of your attendee account?",
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
    <aside className={styles.sidebar}>
      <Link href="/" className={styles.brandLogo}>
        Eventix
      </Link>

      <nav className={styles.sidebarNav}>
        <Link 
          href="/dashboard" 
          className={`${styles.navItem} ${pathname === '/dashboard' ? styles.active : ''}`}
        >
          <LayoutDashboard size={20} /> 
          <span>Dashboard</span>
        </Link>
        <Link 
          href="/dashboard/tickets" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/tickets') ? styles.active : ''}`}
        >
          <Ticket size={20} /> 
          <span>Tickets</span>
        </Link>
        <Link 
          href="/dashboard/orders" 
          className={`${styles.navItem} ${pathname.startsWith('/dashboard/orders') ? styles.active : ''}`}
        >
          <ShoppingBag size={20} /> 
          <span>Orders</span>
        </Link>
        <Link 
          href="/dashboard/profile" 
          className={`${styles.navItem} ${pathname === '/dashboard/profile' ? styles.active : ''}`}
        >
          <User size={20} /> 
          <span>Profile</span>
        </Link>
      </nav>

      <div className={styles.sidebarBottom}>
        <a href="#" onClick={handleLogoutClick} className={styles.navItem}>
          <LogOut size={20} /> <span>Log Out</span>
        </a>
      </div>
    </aside>
  );
}
