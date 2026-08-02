"use client";

import { useState, useEffect } from 'react';
import styles from './Settings.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, CreditCard, Phone, Building, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [availableBanks, setAvailableBanks] = useState([]);
  
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
        if (orgProfile.settlement_bank) setBankCode(orgProfile.settlement_bank);
        setAccountName(orgProfile.account_name || '');
        setSubaccountCode(orgProfile.paystack_subaccount_code || '');
      }
      
      // Fetch Banks
      try {
        const res = await fetch('/api/organizer/paystack/banks');
        const data = await res.json();
        if (res.ok && data.banks) {
          setAvailableBanks(data.banks);
          if (!orgProfile?.settlement_bank && data.banks.length > 0) {
            setBankCode(data.banks[0].code);
          }
        }
      } catch (err) {
        console.error("Failed to load banks:", err);
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
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, phone_number: phoneNumber })
        .eq('id', user.id);
      
      if (profileError) throw profileError;

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

  const handleResolveAccount = async (silent = false) => {
    const selectedBank = availableBanks.find(b => b.code === bankCode);
    const isMobileMoney = selectedBank ? selectedBank.type === 'mobile_money' : ['MTN', 'VOD', 'ATL'].includes(bankCode);
    
    if (!payoutAccount || !bankCode || payoutAccount.length < 10 || isMobileMoney) return;

    setResolving(true);
    setAccountName('');
    try {
      const res = await fetch(`/api/organizer/paystack/resolve?account_number=${payoutAccount}&bank_code=${bankCode}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAccountName(data.account_name);
      if (!silent) showMessage('success', 'Account verified successfully!');
    } catch (err) {
      console.error("❌ Frontend Resolve Error:", err);
      if (!silent) showMessage('error', err.message || 'Failed to verify account');
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    if (payoutAccount && payoutAccount.length >= 10 && payoutAccount.length <= 15) {
      const selectedBank = availableBanks.find(b => b.code === bankCode);
      const isMobileMoney = selectedBank ? selectedBank.type === 'mobile_money' : ['MTN', 'VOD', 'ATL'].includes(bankCode);
      
      if (!isMobileMoney) {
        const timer = setTimeout(() => {
          handleResolveAccount(true);
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [payoutAccount, bankCode, availableBanks]);

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
    return <div className={styles.page} style={{ padding: '3rem 0', textAlign: 'center', color: '#64748b' }}>Loading settings...</div>;
  }

  return (
    <div className={styles.page}>
      
      <div className={styles.header}>
        <h1>Account Settings</h1>
        <p>Manage your account preferences, payout bank details, and security.</p>
      </div>

      {message.text && (
        <div style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          borderRadius: '16px',
          background: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
          border: message.type === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
          color: message.type === 'error' ? '#dc2626' : '#16a34a',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{message.text}</span>
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
            <CreditCard size={18} /> Payout Methods
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
                  <h2>Organization & Contact Profile</h2>
                  <p>Update your public brand name and primary contact details.</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Organization / Brand Name</label>
                    <div className={styles.inputWrapper}>
                      <Building size={18} className={styles.inputIcon} />
                      <input 
                        type="text" 
                        value={businessName} 
                        onChange={(e) => setBusinessName(e.target.value)} 
                        placeholder="e.g. Accra Festival Productions" 
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Contact Person Full Name</label>
                    <div className={styles.inputWrapper}>
                      <User size={18} className={styles.inputIcon} />
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)} 
                        placeholder="e.g. Kwame Mensah" 
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label>Phone Number (Gatekeeper & SMS Notifications)</label>
                    <div className={styles.inputWrapper}>
                      <Phone size={18} className={styles.inputIcon} />
                      <input 
                        type="tel" 
                        value={phoneNumber} 
                        onChange={(e) => setPhoneNumber(e.target.value)} 
                        placeholder="+233 24 123 4567" 
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.btnRow}>
                  <button className={styles.saveBtn} onClick={handleSaveProfile} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Profile Details'}
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
                  <p>Ensure your account is protected with a strong, secure password.</p>
                </div>

                <div className={`${styles.formGrid} ${styles.full}`}>
                  <div className={styles.formGroup}>
                    <label>New Password</label>
                    <div className={styles.inputWrapper}>
                      <ShieldCheck size={18} className={styles.inputIcon} />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
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
                        minLength={6}
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
                  <h2>Paystack Payout Account</h2>
                  <p>Automated settlement bank or MoMo account for ticket revenue payouts.</p>
                </div>

                {subaccountCode ? (
                  <div style={{ padding: '1.25rem 1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', marginBottom: '1.75rem' }}>
                    <h3 style={{ color: '#16a34a', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
                      <ShieldCheck size={20} /> Paystack Payout Subaccount Linked
                    </h3>
                    <p style={{ color: '#15803d', fontSize: '0.92rem', margin: 0 }}>
                      Ticket revenue payouts are automatically routed to <strong>{accountName}</strong> ({bankCode} - {payoutAccount}).
                    </p>
                  </div>
                ) : null}

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Bank or Network Provider</label>
                    <div className={styles.inputWrapper}>
                      <Building size={18} className={styles.inputIcon} />
                      <select 
                        value={bankCode} 
                        onChange={(e) => { setBankCode(e.target.value); setAccountName(''); setSubaccountCode(''); }}
                      >
                        {availableBanks.length > 0 ? (
                          availableBanks.map((bank, index) => (
                            <option key={bank.id || `${bank.code}-${index}`} value={bank.code}>{bank.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="MTN">MTN Mobile Money</option>
                            <option value="VOD">Telecel (Vodafone Cash)</option>
                            <option value="ATL">AirtelTigo Money</option>
                            <option value="040100">GCB Bank</option>
                            <option value="020100">Standard Chartered</option>
                            <option value="130100">Ecobank</option>
                            <option value="240100">Fidelity Bank</option>
                            <option value="140100">CalBank</option>
                          </>
                        )}
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
                          placeholder="e.g. 0241234567" 
                          value={payoutAccount}
                          onChange={(e) => { setPayoutAccount(e.target.value); setAccountName(''); setSubaccountCode(''); }}
                        />
                      </div>
                      {(!availableBanks.find(b => b.code === bankCode)?.type || availableBanks.find(b => b.code === bankCode)?.type !== 'mobile_money') && !['MTN', 'VOD', 'ATL'].includes(bankCode) && (
                        <button 
                          onClick={() => handleResolveAccount(false)} 
                          disabled={resolving || !payoutAccount || payoutAccount.length < 10}
                          style={{ padding: '0 1.5rem', background: 'linear-gradient(135deg, #ff6b2c 0%, #e85d04 100%)', color: '#fff', border: 'none', borderRadius: '50px', cursor: 'pointer', fontWeight: 700, whiteSpace: 'nowrap', opacity: (resolving || !payoutAccount || payoutAccount.length < 10) ? 0.6 : 1 }}
                        >
                          {resolving ? 'Verifying...' : 'Verify'}
                        </button>
                      )}
                    </div>
                  </div>

                  {(availableBanks.find(b => b.code === bankCode)?.type === 'mobile_money' || ['MTN', 'VOD', 'ATL'].includes(bankCode)) ? (
                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                      <label>Registered Account Name</label>
                      <div className={styles.inputWrapper}>
                        <User size={18} className={styles.inputIcon} />
                        <input 
                          type="text" 
                          placeholder="e.g. Kwame Mensah"
                          value={accountName}
                          onChange={(e) => setAccountName(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    accountName && (
                      <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Verified Account Name</label>
                        <div className={styles.inputWrapper}>
                          <User size={18} className={styles.inputIcon} />
                          <input 
                            type="text" 
                            value={accountName}
                            disabled
                            style={{ background: '#f8fafc', color: '#64748b' }}
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
                    style={{ opacity: (!accountName || subaccountCode !== '') ? 0.55 : 1, width: '100%' }}
                  >
                    {saving ? 'Linking Account...' : subaccountCode ? 'Paystack Subaccount Linked' : 'Link Paystack Payout Account'}
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
