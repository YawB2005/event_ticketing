"use client";

import { useState } from 'react';
import styles from './Settings.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, CreditCard, Mail, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account preferences and billing details</p>
      </div>

      <div className={styles.settingsLayout}>
        
        {/* SIDEBAR NAVIGATION */}
        <div className={styles.settingsNav}>
          <button 
            className={`${styles.navBtn} ${activeSection === "Profile" ? styles.active : ''}`}
            onClick={() => setActiveSection("Profile")}
          >
            <User size={18} /> Profile & Organization
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === "Security" ? styles.active : ''}`}
            onClick={() => setActiveSection("Security")}
          >
            <Lock size={18} /> Security
          </button>
          <button 
            className={`${styles.navBtn} ${activeSection === "Billing" ? styles.active : ''}`}
            onClick={() => setActiveSection("Billing")}
          >
            <CreditCard size={18} /> Billing & Payouts
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            
            {activeSection === "Profile" && (
              <motion.div 
                key="Profile"
                className={styles.sectionCard}
                initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Organization Details</h2>
                  <p>Update your public facing organization information.</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Organization Name</label>
                    <div className={styles.inputWrapper}>
                      <Building size={18} className={styles.inputIcon} />
                      <input type="text" defaultValue="Rave Culture Ltd" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Support Email</label>
                    <div className={styles.inputWrapper}>
                      <Mail size={18} className={styles.inputIcon} />
                      <input type="email" defaultValue="support@raveculture.com" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={18} className={styles.inputIcon} />
                      <input type="tel" defaultValue="+233 55 123 4567" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Headquarters Location</label>
                    <div className={styles.inputWrapper}>
                      <MapPin size={18} className={styles.inputIcon} />
                      <input type="text" defaultValue="Accra, Ghana" />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn}>Save Changes</button>
                </div>
              </motion.div>
            )}

            {activeSection === "Security" && (
              <motion.div 
                key="Security"
                className={styles.sectionCard}
                initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Change Password</h2>
                  <p>Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <div className={`${styles.formGrid} ${styles.full}`}>
                  <div className={styles.formGroup}>
                    <label>Current Password</label>
                    <div className={styles.inputWrapper}>
                      <Lock size={18} className={styles.inputIcon} />
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <div className={styles.inputWrapper}>
                      <ShieldCheck size={18} className={styles.inputIcon} />
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <div className={styles.inputWrapper}>
                      <ShieldCheck size={18} className={styles.inputIcon} />
                      <input type="password" placeholder="••••••••" />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn}>Update Password</button>
                </div>
              </motion.div>
            )}

            {activeSection === "Billing" && (
              <motion.div 
                key="Billing"
                className={styles.sectionCard}
                initial="hidden" animate="visible" exit="hidden" variants={fadeUp} transition={{ duration: 0.3 }}
              >
                <div className={styles.sectionHeader}>
                  <h2>Payout Methods</h2>
                  <p>Where should we send the money you earn from ticket sales?</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Payout Method</label>
                    <div className={styles.inputWrapper}>
                      <CreditCard size={18} className={styles.inputIcon} />
                      <select defaultValue="momo">
                        <option value="bank">Bank Transfer</option>
                        <option value="momo">Mobile Money (MTN, Telecel, AT)</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Network Provider</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={18} className={styles.inputIcon} />
                      <select defaultValue="mtn">
                        <option value="mtn">MTN Mobile Money</option>
                        <option value="telecel">Telecel Cash</option>
                        <option value="at">AT Money</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Account / Mobile Number</label>
                    <div className={styles.inputWrapper}>
                      <User size={18} className={styles.inputIcon} />
                      <input type="text" defaultValue="055 123 4567" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Account Name</label>
                    <div className={styles.inputWrapper}>
                      <User size={18} className={styles.inputIcon} />
                      <input type="text" defaultValue="Rave Culture Ltd" />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn}>Save Payout Details</button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
