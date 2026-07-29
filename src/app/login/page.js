"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import styles from './login.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
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

export default function Login() {
  const [role, setRole] = useState('attendee');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      const selectedRole = role; // User's toggle selection ('attendee' | 'organizer')
      if (data?.user) {
        await supabase.auth.updateUser({ data: { role: selectedRole } });
        await initializeUserProfile({
          ...data.user,
          user_metadata: { ...data.user.user_metadata, role: selectedRole }
        });
      }

      if (selectedRole === 'organizer') {
        router.push('/organizer');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?role=${role}&next=${role === 'organizer' ? '/organizer' : '/dashboard'}`,
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
            <Link href="/" style={{ display: 'inline-block', marginBottom: '2rem', fontWeight: 600, color: '#888' }}>
              ← Back to Home
            </Link>
          </motion.div>

          <motion.h2 variants={fadeUp} className={styles.title}>Welcome back</motion.h2>
          <motion.p variants={fadeUp} className={styles.subtitle}>Log in to access your tickets and events.</motion.p>

          <motion.div variants={fadeUp} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '12px' }}>
            <button 
              type="button" 
              onClick={() => setRole('attendee')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: role === 'attendee' ? '#ffffff' : 'transparent',
                color: role === 'attendee' ? '#2563eb' : '#64748b',
                boxShadow: role === 'attendee' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign in as Attendee
            </button>
            <button 
              type="button" 
              onClick={() => setRole('organizer')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: role === 'organizer' ? '#ffffff' : 'transparent',
                color: role === 'organizer' ? '#2563eb' : '#64748b',
                boxShadow: role === 'organizer' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              Sign in as Organizer
            </button>
          </motion.div>

          <motion.div variants={fadeUp}>
            <button 
              type="button" 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={styles.socialBtn}
            >
              <GoogleIcon /> Continue with Google
            </button>

            <div className={styles.divider}>
              <span>or sign in with email</span>
            </div>
          </motion.div>

          <form onSubmit={handleLogin}>
            {error && <motion.div variants={fadeUp} style={{ color: '#ff4d4d', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</motion.div>}

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

            <motion.div variants={fadeUp} className={styles.formGroup}>
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

            <motion.div variants={fadeUp} className={styles.options}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontWeight: 500 }}>
                <input type="checkbox" /> Remember me
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </motion.div>

            <motion.button variants={fadeUp} type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </motion.button>
          </form>

          <motion.div variants={fadeUp} className={styles.signupPrompt}>
            Don't have an account? 
            <Link href="/signup">Sign up</Link>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
