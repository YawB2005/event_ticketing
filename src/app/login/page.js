"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Ticket, 
  Eye, 
  EyeOff, 
  AlertCircle 
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import styles from './login.module.css';

const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      let role = data?.user?.user_metadata?.role;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role) {
          role = profile.role;
        }
      } catch (err) {
        console.error("Error fetching profile role:", err);
      }

      if (role === 'organizer') {
        router.push('/organizer');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    }
  };



  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - VISUAL SHOWCASE (TECH SUMMIT BACKGROUND) */}
      <div className={styles.visualSide}>
        <motion.div 
          className={styles.brandHeader}
          variants={slideLeft} 
          initial="hidden" 
          animate="visible"
        >
          <Link href="/" className={styles.brandLogo}>
            Eventix
          </Link>
          <span className={styles.brandBadge}>Secure Portal</span>
        </motion.div>

        <motion.div 
          className={styles.visualContent}
          variants={slideLeft} 
          initial="hidden" 
          animate="visible" 
          transition={{ delay: 0.2 }}
        >
          <h1 className={styles.visualTitle}>
            Your Gate to <br/> Unforgettable Events
          </h1>
          <p className={styles.visualSubtitle}>
            Log in to manage your tickets, access mobile QR gate check-ins, or control your event dashboard.
          </p>

          <div className={styles.glassFeatureCard}>
            <div className={styles.featureRow}>
              <div className={styles.featureIcon}>
                <Ticket size={20} />
              </div>
              <div className={styles.featureText}>
                <h5>Instant E-Tickets</h5>
                <p>QR passes delivered instantly to your device for 1-second gate verification.</p>
              </div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureIcon} style={{ background: '#2c1206' }}>
                <ShieldCheck size={20} style={{ color: '#ff6b2c' }} />
              </div>
              <div className={styles.featureText}>
                <h5>Encrypted & Verified Checkout</h5>
                <p>100% safe transaction processing with real-time order protection.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className={styles.formSide}>
        <motion.div 
          className={styles.formWrapper}
          variants={slideRight} 
          initial="hidden" 
          animate="visible"
        >
          <Link href="/" className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>

          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your tickets, orders, and event dashboard.</p>

          <form onSubmit={handleLogin}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
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
            </div>

            {/* Password Field */}
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  id="password" 
                  className={styles.input} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className={styles.togglePassBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className={styles.optionsRow}>
              <label className={styles.rememberMe}>
                <input type="checkbox" style={{ accentColor: '#ff6b2c' }} />
                <span>Remember me</span>
              </label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className={styles.authPrompt}>
            Don't have an account yet? 
            <Link href="/signup">Create Account</Link>
          </div>
        </motion.div>
      </div>

    </div>
  );
}
