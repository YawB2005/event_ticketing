"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './ForgotPassword.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    
    // Uses the origin URL for the reset callback
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setStatus({ type: 'error', message: error.message });
    } else {
      setStatus({ type: 'success', message: 'Check your email for the password reset link.' });
      setEmail('');
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - MAGIC */}
      <div className={styles.magicSide}>
        <div className={styles.wavyBg}></div>
        
        {/* Floating stars */}
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
          <motion.div variants={fadeUp}>
            <Link href="/login" style={{ display: 'inline-block', marginBottom: '2rem', fontWeight: 600, color: '#888' }}>
              ← Back to Login
            </Link>
          </motion.div>

          <motion.h2 variants={fadeUp} className={styles.title}>Forgot Password</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</motion.p>

          <form onSubmit={handleResetPassword}>
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
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                className={styles.input} 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>

            <motion.button variants={fadeUp} type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </motion.button>
          </form>

        </motion.div>
      </div>

    </div>
  );
}
