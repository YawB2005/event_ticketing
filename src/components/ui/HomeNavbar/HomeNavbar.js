"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, MapPin, ChevronDown, UserCircle, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
import styles from './HomeNavbar.module.css';

export default function HomeNavbar() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
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

  const handleSearch = (e) => {
    e.preventDefault();
    let query = search;
    if (location) query += ` ${location}`;
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/events');
    }
  };

  const dashboardPath = user?.user_metadata?.role === 'organizer' ? '/organizer' : '/dashboard';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Dashboard';

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.brand}>
        Eventix
      </Link>

      <form className={styles.searchBar} onSubmit={handleSearch}>
        <div className={styles.searchSection}>
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search events" 
            className={styles.searchInput} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.divider}></div>
        <div className={styles.searchSection}>
          <MapPin size={18} />
          <input 
            type="text" 
            placeholder="Your Location" 
            className={styles.searchInput} 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.searchBtn}>
          <Search size={18} color="#fff" />
        </button>
      </form>

      <div className={styles.navLinks}>
        <Link href="/organizer/events/new" className={styles.navLink}>Create Event</Link>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href={dashboardPath} className={styles.userBadge}>
              <UserCircle size={18} />
              <span>{userName}</span>
            </Link>
            <button onClick={handleLogoutClick} className={styles.logoutBtn} title="Log Out">
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        ) : (
          <Link href="/login" className={styles.navLink}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
