"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';
import styles from './AttendeeProfile.module.css';
import { createClient } from '@/utils/supabase/client';

export default function AttendeeProfilePage() {
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', user.id)
        .single();
        
      setProfile({
        fullName: profileData?.full_name || '',
        email: user.email || '',
        phone: profileData?.phone_number || ''
      });
      
      setLoading(false);
    }
    
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.fullName,
          phone_number: profile.phone
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setMessage('Profile details updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setMessage('Error updating profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading profile...</div>;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Personal Profile</h1>
        <p className={styles.subText}>Manage your contact info used for electronic ticket delivery and SMS order confirmations.</p>
      </div>

      <motion.div 
        className={styles.card} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.avatarHeader}>
          <div className={styles.avatarCircle}>
            {profile.fullName ? profile.fullName.charAt(0).toUpperCase() : <User size={32} />}
          </div>
          <div>
            <h2 className={styles.avatarName}>{profile.fullName || 'Attendee'}</h2>
            <span style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 500 }}>Attendee Account</span>
          </div>
        </div>

        {message && (
          <div style={{ 
            padding: '1rem 1.25rem', 
            marginBottom: '1.75rem', 
            borderRadius: '14px', 
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4', 
            border: message.includes('Error') ? '1px solid #fecaca' : '1px solid #bbf7d0',
            color: message.includes('Error') ? '#dc2626' : '#16a34a', 
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                value={profile.fullName} 
                onChange={e => setProfile({...profile, fullName: e.target.value})} 
                placeholder="e.g. Kwame Mensah"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                value={profile.email} 
                disabled
                style={{ opacity: 0.65, cursor: 'not-allowed', background: '#f8fafc' }}
                title="Email cannot be changed directly"
              />
            </div>

            <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Phone Number (Instant SMS Ticket Confirmation)</label>
              <input 
                type="text" 
                value={profile.phone} 
                onChange={e => setProfile({...profile, phone: e.target.value})} 
                placeholder="e.g. +233 24 123 4567"
              />
            </div>
          </div>

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            <Save size={18} /> 
            <span>{saving ? "Saving Changes..." : "Save Profile Changes"}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}
