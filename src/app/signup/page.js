"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './signup.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function Signup() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (!role) {
      setError("Please select whether you want to buy tickets or host events.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
        }
      }
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Wait a bit before redirecting or show a success message to check email
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - MAGIC */}
      <div className={styles.magicSide}>
        <div className={styles.wavyBg}></div>
        
        {/* Floating stars */}
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} transition={{ delay: 0.2 }} className={styles.star} style={{ top: '10%', left: '25%' }}>✦</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.5, scale: 0.8 }} transition={{ delay: 0.4 }} className={styles.star} style={{ top: '30%', right: '10%', color: '#000' }}>✧</motion.div>
        <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.6, scale: 1.2 }} transition={{ delay: 0.6 }} className={styles.star} style={{ bottom: '15%', left: '15%' }}>✦</motion.div>

        <motion.div 
          className={styles.magicShape}
          initial={{ opacity: 0, y: 50, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <h1 className={styles.magicText}>
            Join <br/> the club
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
            <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', fontWeight: 600, color: '#888' }}>
              ← Back to Home
            </Link>
          </motion.div>

          <motion.h2 variants={fadeUp} className={styles.title}>Create account</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Start discovering or hosting unforgettable events.</motion.p>

          <form onSubmit={handleSignup}>
            {error && <motion.div variants={fadeUp} style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</motion.div>}
            {success && <motion.div variants={fadeUp} style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '0.9rem' }}>Account created! Check your email to confirm.</motion.div>}
            
            <motion.div variants={fadeUp} className={styles.roleSelect}>
              <div 
                className={`${styles.roleOption} ${role === 'attendee' ? styles.roleOptionActive : ''}`}
                onClick={() => setRole('attendee')}
              >
                I want to buy tickets
              </div>
              <div 
                className={`${styles.roleOption} ${role === 'organizer' ? styles.roleOptionActive : ''}`}
                onClick={() => setRole('organizer')}
              >
                I want to host events
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                className={styles.input} 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </motion.div>

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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.div variants={fadeUp} className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="password">Password</label>
                <input 
                  type="password" 
                  id="password" 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp} className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="confirmPassword">Confirm</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </motion.div>
            </div>

            <motion.button variants={fadeUp} type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Creating account...' : 'Sign Up'}
            </motion.button>
          </form>

          <motion.div variants={fadeUp} className={styles.loginPrompt}>
            Already have an account? 
            <Link href="/login">Log in</Link>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
