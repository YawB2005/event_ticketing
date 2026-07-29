"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './ResetPassword.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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

    setLoading(true);
    setStatus({ type: '', message: '' });
    
    // Supabase updateUser will automatically use the session obtained from the callback
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setStatus({ type: 'error', message: error.message });
      setLoading(false);
    } else {
      setStatus({ type: 'success', message: 'Password updated successfully! Redirecting...' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - MAGIC */}
      <div className={styles.magicSide}>
        <div className={styles.wavyBg}></div>
        
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 0.2 }} className={styles.star} style={{ top: '15%', left: '20%' }}>✦</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 0.8 }} transition={{ delay: 0.4 }} className={styles.star} style={{ top: '25%', right: '15%', color: '#000' }}>✦</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1.2 }} transition={{ delay: 0.6 }} className={styles.star} style={{ bottom: '20%', left: '10%' }}>✧</motion.div>

        <motion.div 
          className={styles.magicShape}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <h1 className={styles.magicText}>
            Unlock <br/> the magic
          </h1>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className={styles.formSide}>
        <motion.div 
          className={styles.formWrapper}
          initial="hidden" animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
          }}
        >
          <motion.h2 variants={fadeUp} className={styles.title}>Reset Password</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Enter your new password below.</motion.p>

          <form onSubmit={handleUpdatePassword}>
            {status.message && (
              <motion.div 
                variants={fadeUp} 
                style={{ 
                  color: status.type === 'error' ? '#ff4d4d' : '#10b981', 
                  background: status.type === 'error' ? 'rgba(255, 77, 77, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1.5rem', 
                  fontSize: '0.9rem',
                  fontWeight: 500
                }}
              >
                {status.message}
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
              <label htmlFor="confirmPassword">Confirm Password</label>
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
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        </motion.div>
      </div>

    </div>
  );
}
