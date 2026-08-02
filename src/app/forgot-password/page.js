"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './ForgotPassword.module.css';
import { ArrowLeft, KeyRound, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
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
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setStatus({ type: 'error', message: error.message });
      } else {
        setStatus({ type: 'success', message: 'Instructions sent! Check your inbox for the password reset link.' });
        setEmail('');
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - BRAND MAGIC SHOWCASE */}
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
          className={styles.star} 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 0.9, 0.5] }} 
          transition={{ duration: 4, repeat: Infinity, delay: 1 }} 
          style={{ top: '25%', right: '15%', color: '#ff6b2c' }}
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
            Recover Your <br/> Gate Pass Access
          </h1>
          <p style={{ color: 'rgba(252, 248, 242, 0.7)', marginTop: '1.5rem', maxWidth: '380px', margin: '1.5rem auto 0', fontSize: '1.05rem' }}>
            Enter your registered account email to instantly receive a secure password recovery authorization link.
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
          <motion.div variants={fadeUp}>
            <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.75rem', fontWeight: 600, color: 'rgba(252, 248, 242, 0.6)', textDecoration: 'none' }}>
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </motion.div>

          <motion.h2 variants={fadeUp} className={styles.title}>Forgot Password?</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Enter your email address to receive password reset instructions.</motion.p>

          <form onSubmit={handleResetPassword}>
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
              <label htmlFor="email">Email Address</label>
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
              {loading ? 'Sending Instructions...' : 'Send Reset Link'}
            </motion.button>
          </form>

        </motion.div>
      </div>

    </div>
  );
}
