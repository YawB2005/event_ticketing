"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { createClient } from '@/utils/supabase/client';
import { UserCircle, LogOut } from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  
  const [user, setUser] = useState(null);
  const { showConfirm } = useAlert();

  useEffect(() => {
    const supabase = createClient();
    
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    }
    
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    showConfirm({
      title: "Log Out of Eventix",
      message: "Are you sure you want to log out of your account?",
      confirmText: "Yes, Log Out",
      cancelText: "Cancel",
      type: "warning",
      onConfirm: async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/login');
        router.refresh();
      }
    });
  };

  // The landing page navbar should ONLY be displayed on the root landing page ('/')
  if (pathname !== '/') {
    return null;
  }

  const dashboardPath = user?.user_metadata?.role === 'organizer' ? '/organizer' : '/dashboard';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Account';

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        
        {/* Brand Logo */}
        <Link href="/" className={styles.logo}>
          Eventix
        </Link>

        {/* Center Nav Links */}
        {!isAuthPage && (
          <div className={styles.navLinks}>
            <Link href="/events" className={styles.navLink}>
              Explore Events
            </Link>
            <Link href="/organizer" className={styles.navLink}>
              Host an Event
            </Link>
          </div>
        )}

        {/* Auth Actions */}
        {!isAuthPage && (
          <div className={styles.authActions}>
            {user ? (
              <div className={styles.loggedInGroup}>
                <Link href={dashboardPath} className={styles.dashboardBtn}>
                  <UserCircle size={20} />
                  <span>{userName}</span>
                </Link>
                <button onClick={handleLogoutClick} className={styles.logoutBtn} title="Log Out">
                  <LogOut size={16} />
                  <span className={styles.logoutText}>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link href="/login" className={styles.loginBtn}>
                  Log In
                </Link>
                <Link href="/signup" className={styles.signUpBtn}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
