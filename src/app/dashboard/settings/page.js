"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Shield, Save, ArrowRight } from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
import styles from './AttendeeSettings.module.css';

export default function AttendeeSettingsPage() {
  const { showAlert } = useAlert();
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: true, promo: false });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.next !== passwords.confirm) {
      showAlert("New passwords do not match", "error", "Password Mismatch");
      return;
    }
    showAlert("Security password updated successfully!", "success", "Security Settings");
    setPasswords({ current: '', next: '', confirm: '' });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p className={styles.subText}>Configure your security options and notification preferences.</p>
      </div>

      <motion.div 
        className={styles.card} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>
          <Lock size={20} style={{ color: '#ff6b2c' }} /> 
          <span>Security & Password</span>
        </h2>

        <form onSubmit={handlePasswordChange}>
          <div className={styles.inputGroup}>
            <label>Current Password</label>
            <input 
              type="password" 
              value={passwords.current} 
              onChange={e => setPasswords({...passwords, current: e.target.value})} 
              placeholder="••••••••"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label>New Password</label>
            <input 
              type="password" 
              value={passwords.next} 
              onChange={e => setPasswords({...passwords, next: e.target.value})} 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirm New Password</label>
            <input 
              type="password" 
              value={passwords.confirm} 
              onChange={e => setPasswords({...passwords, confirm: e.target.value})} 
              placeholder="••••••••"
              required 
              minLength={6}
            />
          </div>

          <button type="submit" className={styles.saveBtn}>
            <Save size={18} />
            <span>Update Password</span>
          </button>
        </form>
      </motion.div>

      <motion.div 
        className={styles.card} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2>
          <Bell size={20} style={{ color: '#ff6b2c' }} /> 
          <span>Notification Preferences</span>
        </h2>
        
        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>Email Ticket Receipts</span>
            <span className={styles.toggleSub}>Receive instant order confirmations and PDF ticket attachments</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.email} 
            onChange={e => setNotifications({...notifications, email: e.target.checked})} 
            style={{ accentColor: '#ff6b2c', transform: 'scale(1.3)', cursor: 'pointer' }} 
          />
        </div>

        <div className={styles.toggleRow}>
          <div className={styles.toggleInfo}>
            <span className={styles.toggleLabel}>SMS Gate Reminders</span>
            <span className={styles.toggleSub}>Receive SMS text alerts on event day with venue maps and entrance QR links</span>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.sms} 
            onChange={e => setNotifications({...notifications, sms: e.target.checked})} 
            style={{ accentColor: '#ff6b2c', transform: 'scale(1.3)', cursor: 'pointer' }} 
          />
        </div>
      </motion.div>
    </div>
  );
}
