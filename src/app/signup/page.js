"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './signup.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export default function Signup() {
  const [role, setRole] = useState('buyer');

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

          <form onSubmit={(e) => e.preventDefault()}>
            
            <motion.div variants={fadeUp} className={styles.roleSelect}>
              <div 
                className={`${styles.roleOption} ${role === 'buyer' ? styles.roleOptionActive : ''}`}
                onClick={() => setRole('buyer')}
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
              <input type="text" id="name" className={styles.input} placeholder="John Doe" />
            </motion.div>

            <motion.div variants={fadeUp} className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" className={styles.input} placeholder="name@example.com" />
            </motion.div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <motion.div variants={fadeUp} className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" className={styles.input} placeholder="••••••••" />
              </motion.div>

              <motion.div variants={fadeUp} className={styles.formGroup} style={{ flex: 1 }}>
                <label htmlFor="confirmPassword">Confirm</label>
                <input type="password" id="confirmPassword" className={styles.input} placeholder="••••••••" />
              </motion.div>
            </div>

            <motion.button variants={fadeUp} type="submit" className={styles.submitBtn}>
              Sign Up
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
