"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  Instagram, 
  Twitter, 
  CheckCircle,
  CreditCard
} from 'lucide-react';
import styles from './OrganizerProfile.module.css';

export default function OrganizerProfilePage() {
  const [profile, setProfile] = useState({
    companyName: 'Neon Wave Productions',
    email: 'contact@neonwave.com',
    phone: '+233 24 123 4567',
    website: 'https://neonwave.com',
    bio: 'Premier event organizers specializing in electronic festivals, live acoustics, and night culture in West Africa.',
    twitter: '@neonwave_accra',
    instagram: '@neonwave.events',
    payoutBank: 'MTN Mobile Money / GCB Bank',
    accountNumber: '024XXXX567'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    alert("Organizer profile details saved successfully!");
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Organizer Public Profile</h1>
        <p className={styles.subText}>Manage public event details, branding, contact info, and payout accounts</p>
      </div>

      <motion.div 
        className={styles.profileCard}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.banner}>
          <div className={styles.avatarWrapper}>
            NW
          </div>
        </div>

        <form className={styles.profileContent} onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Organization / Brand Name</label>
              <input 
                type="text" 
                value={profile.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Contact Email</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input 
                type="text" 
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Website URL</label>
              <input 
                type="text" 
                value={profile.website}
                onChange={(e) => handleChange('website', e.target.value)}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>About Organizer / Bio</label>
              <textarea 
                rows={4}
                value={profile.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Twitter / X Handle</label>
              <input 
                type="text" 
                value={profile.twitter}
                onChange={(e) => handleChange('twitter', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Instagram Handle</label>
              <input 
                type="text" 
                value={profile.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Default Payout Account</label>
              <input 
                type="text" 
                value={profile.payoutBank}
                onChange={(e) => handleChange('payoutBank', e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Account / MoMo Number</label>
              <input 
                type="text" 
                value={profile.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn} disabled={isSaving}>
            <Save size={18} /> {isSaving ? "Saving..." : "Save Profile Details"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
