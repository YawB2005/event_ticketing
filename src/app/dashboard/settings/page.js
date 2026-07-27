"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Shield, Save } from 'lucide-react';
import styles from './AttendeeSettings.module.css';

export default function AttendeeSettingsPage() {
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: true, promo: false });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert("Password updated successfully!");
    setPasswords({ current: '', next: '', confirm: '' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p className={styles.subText}>Configure your security options and notification preferences.</p>
      </div>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2><Lock size={20} style={{ display: 'inline', marginRight: '8px', color: '#38bdf8' }} /> Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div className={styles.inputGroup}>
            <label>Current Password</label>
            <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} required />
          </div>

          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input type="password" value={passwords.next} onChange={e => setPasswords({...passwords, next: e.target.value})} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} required />
          </div>

          <button type="submit" className={styles.saveBtn}>Update Password</button>
        </form>
      </motion.div>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2><Bell size={20} style={{ display: 'inline', marginRight: '8px', color: '#38bdf8' }} /> Notification Preferences</h2>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Email Ticket Receipts</span>
            <span className={styles.toggleSub}>Receive instant order confirmations and PDF ticket attachments</span>
          </div>
          <input type="checkbox" checked={notifications.email} onChange={e => setNotifications({...notifications, email: e.target.checked})} style={{ transform: 'scale(1.3)' }} />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>SMS Gate Reminders</span>
            <span className={styles.toggleSub}>Receive SMS text alerts on event day with venue maps and entrance QR links</span>
          </div>
          <input type="checkbox" checked={notifications.sms} onChange={e => setNotifications({...notifications, sms: e.target.checked})} style={{ transform: 'scale(1.3)' }} />
        </div>
      </motion.div>
    </div>
  );
}
