"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2, RefreshCw } from 'lucide-react';
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

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

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
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [resendStatus, setResendStatus] = useState('');
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setError(null);
    setStep(2);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    const selectedRole = role || 'attendee';
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}&next=${selectedRole === 'organizer' ? '/organizer' : '/dashboard'}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (oauthError) {
      if (oauthError.message?.includes('provider is not enabled')) {
        setError('Google Sign-In is not enabled in your Supabase project yet. Please enable Google under Authentication > Providers in your Supabase Dashboard.');
      } else {
        setError(oauthError.message);
      }
      setLoading(false);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (role === 'attendee') {
      submitSignup();
    } else {
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
        emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}`,
        data: {
          full_name: name,
          role: role,
          business_name: businessName
        }
      }
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
    } else if (data?.user?.identities?.length === 0) {
      setError("An account with this email already exists. Please log in instead.");
      setLoading(false);
    } else {
      if (data?.session) {
        await initializeUserProfile(data.user);
        setSuccess(true);
        setLoading(false);
        if (role === 'organizer') {
          router.push('/organizer');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Email verification required
        setSuccess(true);
        setEmailVerificationSent(true);
        setLoading(false);
      }
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setResendStatus('');
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?role=${role}`,
      }
    });

    setResending(false);
    if (resendError) {
      setResendStatus(`Error: ${resendError.message}`);
    } else {
      setResendStatus('Verification email resent successfully! Check your inbox.');
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
            {step > 1 && !emailVerificationSent ? (
               <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginBottom: '2rem', fontWeight: 600, color: '#888', display: 'flex', alignItems: 'center', fontSize: '1rem' }}>
                 ← Back
               </button>
            ) : (
               <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', fontWeight: 600, color: '#888' }}>
                 ← Back to Home
               </Link>
            )}
          </motion.div>

          {!emailVerificationSent ? (
            <>
              <motion.h2 initial="hidden" animate="visible" variants={fadeUp} className={styles.title}>
                 {step === 1 ? 'Create account' : step === 2 ? 'Your details' : 'Organization info'}
              </motion.h2>
              <motion.p initial="hidden" animate="visible" variants={fadeUp} className={styles.subtitle}>
                 {step === 1 ? 'Start discovering or hosting unforgettable events.' : step === 2 ? 'Let us know who you are.' : 'What do you call your business?'}
              </motion.p>

              {/* Social Login Button */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <button 
                  type="button" 
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className={styles.socialBtn}
                >
                  <GoogleIcon /> Continue with Google
                </button>

                <div className={styles.divider}>
                  <span>or register with email</span>
                </div>
              </motion.div>

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
                      <div className={styles.roleSelect} style={{ marginTop: '1rem' }}>
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
                      style={{ marginTop: '1rem' }}
                    >
                      {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                      
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
                      style={{ marginTop: '1rem' }}
                    >
                      {error && <div style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
                      
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
                    </motion.form>
                  )}

                </AnimatePresence>
              </div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} className={styles.loginPrompt} style={{ marginTop: '2rem' }}>
                Already have an account? 
                <Link href="/login">Log in</Link>
              </motion.div>
            </>
          ) : (
            /* EMAIL VERIFICATION REQUIRED SCREEN */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className={styles.verificationCard}
            >
              <div className={styles.verificationIcon}>
                <Mail size={32} />
              </div>
              <h2 className={styles.verificationTitle}>Check your email</h2>
              <p className={styles.verificationText}>
                We've sent a verification link to <strong>{email}</strong>.<br />
                Please open your email inbox and click the verification link to activate your account before logging in.
              </p>

              {resendStatus && (
                <div style={{ color: resendStatus.startsWith('Error') ? '#dc2626' : '#16a34a', fontSize: '0.88rem', marginBottom: '1rem', fontWeight: 500 }}>
                  {resendStatus}
                </div>
              )}

              <div className={styles.verificationActions}>
                <button 
                  onClick={handleResendEmail} 
                  disabled={resending}
                  className={styles.resendBtn}
                >
                  {resending ? 'Resending...' : 'Resend Verification Email'}
                </button>
                <Link 
                  href="/login" 
                  className={styles.submitBtn} 
                  style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                >
                  Go to Sign In
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>

    </div>
  );
}
