"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { initializeUserProfile } from '@/app/actions/profile';
import styles from './signup.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

export default function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  
  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Organizer info
  const [businessName, setBusinessName] = useState('');

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
    setStep(2);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // If attendee, submit directly
    if (role === 'attendee') {
      submitSignup();
    } else {
      // If organizer, go to step 3
      setStep(3);
    }
  };

  const submitSignup = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    if (role === 'organizer' && !businessName.trim()) {
      setError("Business Name is required for organizers");
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: role,
          business_name: businessName // only used if organizer
        }
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else {
      if (data?.session) {
        await initializeUserProfile(data.user);
      }
      setSuccess(true);
      setLoading(false);
      // Role-based post-signup landing page redirection
      if (role === 'organizer') {
        router.push('/organizer');
      } else {
        router.push('/home');
      }
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
        <div className={styles.formWrapper}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {step > 1 && !success ? (
               <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '2rem', fontWeight: 600, color: '#888', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                 ← Back
               </button>
            ) : (
               <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', fontWeight: 600, color: '#888' }}>
                 ← Back to Home
               </Link>
            )}
          </motion.div>

          <motion.h2 initial="hidden" animate="visible" variants={fadeUp} className={styles.title}>
             {step === 1 ? 'Create account' : step === 2 ? 'Your details' : 'Organization info'}
          </motion.h2>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} className={styles.subtitle}>
             {step === 1 ? 'Start discovering or hosting unforgettable events.' : step === 2 ? 'Let us know who you are.' : 'What do you call your business?'}
          </motion.p>

          <div style={{ position: 'relative' }}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: ROLE SELECTION */}
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial="hidden" animate="visible" exit="exit"
                  variants={slideLeft}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.roleSelect} style={{ marginTop: '2rem' }}>
                    <div 
                      className={`${styles.roleOption} ${role === 'attendee' ? styles.roleOptionActive : ''}`}
                      onClick={() => handleRoleSelect('attendee')}
                    >
                      I want to buy tickets
                    </div>
                    <div 
                      className={`${styles.roleOption} ${role === 'organizer' ? styles.roleOptionActive : ''}`}
                      onClick={() => handleRoleSelect('organizer')}
                    >
                      I want to host events
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BASIC INFO */}
              {step === 2 && (
                <motion.form 
                  key="step2"
                  initial="hidden" animate="visible" exit="exit"
                  variants={slideLeft}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleNextStep}
                  style={{ marginTop: '2rem' }}
                >
                  {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                  {success && <div style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '0.9rem' }}>Account created! Check your email to confirm.</div>}
                  
                  {!success && (
                    <>
                      <div className={styles.formGroup}>
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
                      </div>

                      <div className={styles.formGroup}>
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
                      </div>

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                          <label htmlFor="password">Password</label>
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
                        </div>

                        <div className={styles.formGroup} style={{ flex: 1 }}>
                          <label htmlFor="confirmPassword">Confirm</label>
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
                        </div>
                      </div>

                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Processing...' : role === 'organizer' ? 'Next Step →' : 'Complete Sign Up'}
                      </button>
                    </>
                  )}
                </motion.form>
              )}

              {/* STEP 3: ORGANIZER INFO */}
              {step === 3 && (
                <motion.form 
                  key="step3"
                  initial="hidden" animate="visible" exit="exit"
                  variants={slideLeft}
                  transition={{ duration: 0.3 }}
                  onSubmit={submitSignup}
                  style={{ marginTop: '2rem' }}
                >
                  {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                  {success && <div style={{ color: '#4caf50', marginBottom: '1rem', fontSize: '0.9rem' }}>Account created! Check your email to confirm.</div>}
                  
                  {!success && (
                    <>
                      <div className={styles.formGroup}>
                        <label htmlFor="businessName">Business Name / Organization Name</label>
                        <input 
                          type="text" 
                          id="businessName" 
                          className={styles.input} 
                          placeholder="e.g. Rave Culture Ltd" 
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Creating account...' : 'Complete Sign Up'}
                      </button>
                    </>
                  )}
                </motion.form>
              )}

            </AnimatePresence>
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.loginPrompt} style={{ marginTop: '2rem' }}>
            Already have an account? 
            <Link href="/login">Log in</Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
