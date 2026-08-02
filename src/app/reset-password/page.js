"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './ResetPassword.module.css';
import { ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }
    if (password.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });
    
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setStatus({ type: 'error', message: error.message });
        setLoading(false);
      } else {
        setStatus({ type: 'success', message: 'Password updated successfully! Redirecting to login...' });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to update password.' });
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - MAGIC SHOWCASE */}
      <div className={styles.magicSide}>
        <motion.div 
          className={styles.star} 
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }} 
          transition={{ duration: 3, repeat: Infinity }} 
          style={{ top: '15%', left: '20%' }}
        >
          ✦
        </motion.div>

        <motion.div 
          className={styles.magicShape}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className={styles.magicText}>
            Set Your New <br/> Secure Key
          </h1>
          <p style={{ color: 'rgba(252, 248, 242, 0.7)', marginTop: '1.5rem', maxWidth: '380px', margin: '1.5rem auto 0', fontSize: '1.05rem' }}>
            Choose a strong password to protect your account and ticket pass purchases.
          </p>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className={styles.formSide}>
        <motion.div 
          className={styles.formWrapper}
          initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.h2 variants={fadeUp} className={styles.title}>Reset Password</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Enter your new password below.</motion.p>

          <form onSubmit={handleUpdatePassword}>
            {status.message && (
              <motion.div 
                variants={fadeUp} 
                style={{ 
                  color: status.type === 'error' ? '#fca5a5' : '#6ee7b7', 
                  background: status.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  border: status.type === 'error' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '1rem 1.25rem',
                  borderRadius: '16px',
                  marginBottom: '1.5rem', 
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {status.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{status.message}</span>
              </motion.div>
            )}

            <motion.div variants={fadeUp} className={styles.formGroup}>
              <label htmlFor="password">New Password</label>
              <input 
                type="password" 
                id="password" 
                className={styles.input} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </motion.div>

            <motion.div variants={fadeUp} className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                className={styles.input} 
                placeholder="••••••••" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </motion.div>

            <motion.button variants={fadeUp} type="submit" className={styles.submitBtn} disabled={loading || status.type === 'success'}>
              {loading ? 'Updating Password...' : 'Update Password'}
            </motion.button>
          </form>
        </motion.div>
      </div>

    </div>
  );
}
