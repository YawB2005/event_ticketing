"use client";

import { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, CreditCard, Phone, Building, ShieldCheck } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("Profile");
  const [user, setUser] = useState(null);
  
  // Form states
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Paystack Billing states
  const [payoutAccount, setPayoutAccount] = useState('');
  const [bankCode, setBankCode] = useState('MTN');
  const [accountName, setAccountName] = useState('');
  const [subaccountCode, setSubaccountCode] = useState('');
  const [resolving, setResolving] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // Fetch PROFILES
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone_number')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setFullName(profile.full_name || '');
        setPhoneNumber(profile.phone_number || '');
      }

      // Fetch ORGANIZER_PROFILES
      const { data: orgProfile } = await supabase
        .from('organizer_profiles')
        .select('business_name, payout_account_number, settlement_bank, account_name, paystack_subaccount_code')
        .eq('profile_id', user.id)
        .single();

      if (orgProfile) {
        setBusinessName(orgProfile.business_name || '');
        setPayoutAccount(orgProfile.payout_account_number || '');
        setBankCode(orgProfile.settlement_bank || 'MTN');
        setAccountName(orgProfile.account_name || '');
        setSubaccountCode(orgProfile.paystack_subaccount_code || '');
      }
      
      setLoading(false);
    }
    loadProfile();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      // Update profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone_number: phoneNumber })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

      // Update or insert organizer_profiles
      const { error: orgError } = await supabase
        .from('organizer_profiles')
        .upsert({ 
          profile_id: user.id, 
          business_name: businessName 
        });

      if (orgError) throw orgError;

      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResolveAccount = async () => {
    if (!payoutAccount || !bankCode) return;
    setResolving(true);
    setAccountName('');
    try {
      const res = await fetch(`/api/organizer/paystack/resolve?account_number=${payoutAccount}&bank_code=${bankCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAccountName(data.account_name);
      showMessage('success', 'Account verified successfully!');
    } catch (err) {
      console.error("❌ Frontend Resolve Error:", err);
      showMessage('error', err.message || 'Failed to verify account');
    } finally {
      setResolving(false);
    }
  };

  const handleLinkPaystack = async () => {
    if (!accountName) {
      showMessage('error', 'Please verify your account first');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/organizer/paystack/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: businessName || fullName,
          settlement_bank: bankCode,
          account_number: payoutAccount,
          account_name: accountName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setSubaccountCode(data.subaccount_code);
      showMessage('success', 'Paystack account linked successfully!');
    } catch (err) {
      console.error("❌ Frontend Link Error:", err);
      showMessage('error', err.message || 'Failed to link account');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      showMessage('success', 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showMessage('error', err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.page} style={{ padding: '2rem' }}>Loading settings...</div>;
  }

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1>Settings</h1>
        <p>Manage your account preferences and billing details</p>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          background: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#ef4444' : '#16a34a',
          fontWeight: 500
        }}>
          {message.text}
        </div>
      )}

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
                      <input 
                        type="text" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        placeholder="e.g. Rave Culture Ltd" 
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Full Name (Contact Person)</label>
                    <div className={styles.inputWrapper}>
                      <User size={18} className={styles.inputIcon} />
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="John Doe" 
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={18} className={styles.inputIcon} />
                      <input 
                        type="tel" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="+233 55 123 4567" 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
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
                    <label>Current Password (Optional)</label>
                    <div className={styles.inputWrapper}>
                      <Lock size={18} className={styles.inputIcon} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <div className={styles.inputWrapper}>
                      <ShieldCheck size={18} className={styles.inputIcon} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirm New Password</label>
                    <div className={styles.inputWrapper}>
                      <ShieldCheck size={18} className={styles.inputIcon} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn} onClick={handleUpdatePassword} disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
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
                  <p>Where should we send the money you earn from ticket sales? We partner with Paystack for secure, automated payouts.</p>
                </div>

                {subaccountCode ? (
                  <div style={{ padding: '1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h3 style={{ color: '#16a34a', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <ShieldCheck size={20} /> Paystack Subaccount Linked
                    </h3>
                    <p style={{ color: '#15803d', fontSize: '0.95rem' }}>
                      Your ticket sales will be automatically routed to <strong>{accountName}</strong> ({bankCode} - {payoutAccount}).
                    </p>
                  </div>
                ) : null}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Bank or Network Provider</label>
                    <div className={styles.inputWrapper}>
                      <Building size={18} className={styles.inputIcon} />
                      <select 
                        className={styles.input} 
                        value={bankCode} 
                        onChange={(e) => { setBankCode(e.target.value); setAccountName(''); setSubaccountCode(''); }}
                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none', appearance: 'none', background: '#fff' }}
                      >
                        <option value="MTN">MTN Mobile Money</option>
                        <option value="VOD">Telecel (Vodafone Cash)</option>
                        <option value="ATL">AirtelTigo Money</option>
                        <option value="040100">GCB Bank</option>
                        <option value="020100">Standard Chartered</option>
                        <option value="130100">Ecobank</option>
                        <option value="240100">Fidelity Bank</option>
                        <option value="140100">CalBank</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Account / MoMo Number</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <div className={styles.inputWrapper} style={{ flex: 1 }}>
                        <CreditCard size={18} className={styles.inputIcon} />
                        <input 
                          type="text" 
                          placeholder="e.g. 0551234567" 
                          value={payoutAccount}
                          onChange={(e) => { setPayoutAccount(e.target.value); setAccountName(''); setSubaccountCode(''); }}
                          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                        />
                      </div>
                      {!['MTN', 'VOD', 'ATL'].includes(bankCode) && (
                        <button 
                          onClick={handleResolveAccount} 
                          disabled={resolving || !payoutAccount || payoutAccount.length < 10}
                          style={{ padding: '0 1.5rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap', opacity: (resolving || !payoutAccount || payoutAccount.length < 10) ? 0.6 : 1 }}
                        >
                          {resolving ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>

                  {['MTN', 'VOD', 'ATL'].includes(bankCode) ? (
                    <div className={styles.formGroup}>
                      <label>Registered Account Name</label>
                      <div className={styles.inputWrapper}>
                        <User size={18} className={styles.inputIcon} />
                        <input 
                          type="text" 
                          placeholder="e.g. John Doe"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', outline: 'none' }}
                        />
                      </div>
                    </div>
                  ) : (
                    accountName && (
                      <div className={styles.formGroup}>
                        <label>Verified Account Name</label>
                        <div className={styles.inputWrapper}>
                          <User size={18} className={styles.inputIcon} />
                          <input 
                            type="text" 
                            value={accountName}
                            disabled
                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc', color: '#334155' }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className={styles.btnRow}>
                  <button 
                    className={styles.saveBtn} 
                    onClick={handleLinkPaystack} 
                    disabled={saving || !accountName || subaccountCode !== ''}
                    style={{ opacity: (!accountName || subaccountCode !== '') ? 0.5 : 1, width: '100%' }}
                  >
                    {saving ? 'Linking...' : subaccountCode ? 'Paystack Successfully Linked!' : 'Create Paystack Subaccount'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
