"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, User, Settings, LogOut, ChevronDown, Ticket } from 'lucide-react';
import styles from './DashboardHeader.module.css';

export default function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const isOrganizer = pathname.startsWith('/organizer');
  const userInitials = isOrganizer ? 'RC' : 'AM';
  const userName = isOrganizer ? 'Rave Culture' : 'Alex Morgan';
  const userRole = isOrganizer ? 'Organizer' : 'Attendee';
  const profileLink = isOrganizer ? '/organizer/profile' : '/dashboard/profile';
  const settingsLink = isOrganizer ? '/organizer/settings' : '/dashboard/settings';

  return (
    <header className={styles.header}>
      <div className={styles.searchBox}>
        <Search size={18} className={styles.searchIcon} />
        <input 
          type="text" 
          placeholder={isOrganizer ? "Search events or attendees..." : "Search tickets or orders..."} 
          className={styles.searchInput}
        />
      </div>

      <div className={styles.rightActions}>
        <button className={styles.iconBtn} title="Notifications">
          <Bell size={18} />
          <span className={styles.badgeDot} />
        </button>

        <div className={styles.userMenuWrapper}>
          <div className={styles.userPill} onClick={() => setMenuOpen(!menuOpen)}>
            <div className={styles.avatar}>{userInitials}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRole}>{userRole}</span>
            </div>
            <ChevronDown size={16} style={{ color: '#64748b', transition: 'transform 0.2s ease', transform: menuOpen ? 'rotate(180deg)' : 'none' }} />
          </div>

          {menuOpen && (
            <div className={styles.dropdown} onClick={() => setMenuOpen(false)}>
              <Link href={profileLink} className={styles.dropdownItem}>
                <User size={16} /> My Profile
              </Link>
              <Link href={settingsLink} className={styles.dropdownItem}>
                <Settings size={16} /> Account Settings
              </Link>
              <button className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => router.push('/')}>
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
