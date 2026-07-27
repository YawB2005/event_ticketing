"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import styles from './AttendeeProfile.module.css';

export default function AttendeeProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Alex Morgan',
    email: 'alex.m@example.com',
    phone: '+233 24 987 6543',
    city: 'Accra, Ghana'
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(res => setTimeout(res, 600));
    setSaving(false);
    alert("Profile details updated successfully!");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Personal Profile</h1>
        <p className={styles.subText}>Manage your contact info used for electronic ticket delivery and SMS order confirmations.</p>
      </div>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.avatarHeader}>
          <div className={styles.avatarCircle}>AM</div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#ffffff' }}>{profile.fullName}</h2>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Attendee Account</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={e => setProfile({...profile, fullName: e.target.value})} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={profile.email} 
                onChange={e => setProfile({...profile, email: e.target.value})} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number (SMS Confirmation)</label>
              <input 
                type="text" 
                value={profile.phone} 
                onChange={e => setProfile({...profile, phone: e.target.value})} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City / Location</label>
              <input 
                type="text" 
                value={profile.city} 
                onChange={e => setProfile({...profile, city: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            <Save size={18} /> {saving ? "Saving..." : "Save Profile Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
