"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Ticket, 
  Sparkles, 
  Users, 
  AlertCircle, 
  CheckCircle2,
  MailCheck
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { initializeUserProfile } from '@/app/actions/profile';
import styles from './signup.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

const slideLeft = {
  hidden: { opacity: 0, x: 45 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, x: -45, transition: { duration: 0.3 } }
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
      setError("Organization/Business Name is required for event hosts");
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
    } else {
      if (data?.session) {
        await initializeUserProfile(data.user);
      }
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      
      {/* LEFT SIDE - VISUAL SHOWCASE (OUTDOOR CULTURAL FESTIVAL BACKGROUND) */}
      <div className={styles.visualSide}>
        <motion.div 
          className={styles.brandHeader}
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className={styles.brandLogo}>
            Eventix
          </Link>
          <span className={styles.brandBadge}>Join Platform</span>
        </motion.div>

        <motion.div 
          className={styles.visualContent}
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className={styles.visualTitle}>
            Discover & Host <br/> Live Experiences
          </h1>
          <p className={styles.visualSubtitle}>
            Join thousands of event lovers discovering tech summits, cultural festivals, sports marathons, comedy shows, and workshops.
          </p>

          <div className={styles.glassFeatureCard}>
            <div className={styles.featureRow}>
              <div className={styles.featureIcon}>
                <Ticket size={20} />
              </div>
              <div className={styles.featureText}>
                <h5>Instant Access & E-Tickets</h5>
                <p>Never lose a ticket. Access your digital passes anytime with real-time QR gate scanning.</p>
              </div>
            </div>

            <div className={styles.featureRow}>
              <div className={styles.featureIcon} style={{ background: '#2c1206' }}>
                <Sparkles size={20} style={{ color: '#ff6b2c' }} />
              </div>
              <div className={styles.featureText}>
                <h5>Powerful Organizer Dashboard</h5>
                <p>Host events, manage ticket tiers, track sales analytics, and scan gate passes effortlessly.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM CONTAINER */}
      <div className={styles.formSide}>
        <div className={styles.formWrapper}>
          
          {success ? (
            /* EMAIL VERIFICATION CONFIRMATION CARD */
            <motion.div 
              className={styles.verificationCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.mailIconWrap}>
                <MailCheck size={44} style={{ color: '#ff6b2c' }} />
              </div>
              <h2 className={styles.title} style={{ fontSize: '1.85rem' }}>Check Your Email</h2>
              <p className={styles.subtitle} style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
                We've sent a verification link to <strong style={{ color: '#2c1206' }}>{email}</strong>. Please check your email inbox and click the verification link to confirm your account.
              </p>
              
              <div className={styles.verificationNote}>
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>Once verified, you can sign in to access your {role === 'organizer' ? 'event host dashboard' : 'e-tickets'}.</span>
              </div>

              <Link href="/login" className={styles.submitBtn} style={{ marginTop: '1.75rem', textDecoration: 'none' }}>
                <span>Proceed to Sign In</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Top Navigation */}
              <motion.div variants={fadeUp} initial="hidden" animate="visible">
                {step > 1 ? (
                  <button 
                    type="button"
                    onClick={() => setStep(step - 1)} 
                    className={styles.backLink}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to previous step</span>
                  </button>
                ) : (
                  <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    <span>Back to Home</span>
                  </Link>
                )}
              </motion.div>

              {/* Step Progress Indicator Bar */}
              <div className={styles.stepIndicator}>
                <div className={`${styles.stepPill} ${step >= 1 ? styles.stepPillActive : ''}`}></div>
                <div className={`${styles.stepPill} ${step >= 2 ? styles.stepPillActive : ''}`}></div>
                {role === 'organizer' && (
                  <div className={`${styles.stepPill} ${step >= 3 ? styles.stepPillActive : ''}`}></div>
                )}
              </div>

              <motion.h2 variants={fadeUp} initial="hidden" animate="visible" className={styles.title}>
                {step === 1 ? 'Join Eventix' : step === 2 ? 'Your Details' : 'Organization Info'}
              </motion.h2>
              
              <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }} className={styles.subtitle}>
                {step === 1 ? 'Step 1: Choose whether you want to buy tickets or host events.' : step === 2 ? 'Enter your personal account credentials.' : 'Tell us about your organization or brand.'}
              </motion.p>

              {error && (
                <div className={styles.errorAlert}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: ROLE SELECTION CARDS */}
                  {step === 1 && (
                    <motion.div 
                      key="step1"
                      initial="hidden" animate="visible" exit="exit"
                      variants={slideLeft}
                    >
                      <div className={styles.roleGrid}>
                        
                        <div 
                          className={`${styles.roleCard} ${role === 'attendee' ? styles.roleCardActive : ''}`}
                          onClick={() => handleRoleSelect('attendee')}
                        >
                          <div className={styles.roleCardIcon}>
                            <Users size={26} />
                          </div>
                          <div className={styles.roleCardText}>
                            <h4>I want to buy tickets (Attendee)</h4>
                            <p>Discover concerts, tech summits, sports & shows, and manage your e-tickets.</p>
                          </div>
                        </div>

                        <div 
                          className={`${styles.roleCard} ${role === 'organizer' ? styles.roleCardActive : ''}`}
                          onClick={() => handleRoleSelect('organizer')}
                        >
                          <div className={styles.roleCardIcon} style={{ background: 'rgba(44, 18, 6, 0.12)', color: '#2c1206' }}>
                            <Sparkles size={26} />
                          </div>
                          <div className={styles.roleCardText}>
                            <h4>I want to host events (Event Host)</h4>
                            <p>Create event listings, customize ticket tiers, track revenue, and scan QR passes.</p>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: ACCOUNT DETAILS */}
                  {step === 2 && (
                    <motion.form 
                      key="step2"
                      initial="hidden" animate="visible" exit="exit"
                      variants={slideLeft}
                      onSubmit={handleNextStep}
                    >
                      <div className={styles.formGroup}>
                        <label htmlFor="name">Full Name</label>
                        <div className={styles.inputWrap}>
                          <User size={18} className={styles.inputIcon} />
                          <input 
                            type="text" 
                            id="name" 
                            className={styles.input} 
                            placeholder="e.g. Kwame Mensah" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

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

                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className={styles.formGroup} style={{ flex: 1 }}>
                          <label htmlFor="password">Password</label>
                          <div className={styles.inputWrap}>
                            <Lock size={18} className={styles.inputIcon} />
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
                        </div>

                        <div className={styles.formGroup} style={{ flex: 1 }}>
                          <label htmlFor="confirmPassword">Confirm Password</label>
                          <div className={styles.inputWrap}>
                            <Lock size={18} className={styles.inputIcon} />
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
                      </div>

                      <motion.button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{loading ? 'Processing...' : role === 'organizer' ? 'Next Step' : 'Create Account'}</span>
                        <ArrowRight size={18} />
                      </motion.button>
                    </motion.form>
                  )}

                  {/* STEP 3: ORGANIZER INFO */}
                  {step === 3 && (
                    <motion.form 
                      key="step3"
                      initial="hidden" animate="visible" exit="exit"
                      variants={slideLeft}
                      onSubmit={submitSignup}
                    >
                      <div className={styles.formGroup}>
                        <label htmlFor="businessName">Organization / Brand Name</label>
                        <div className={styles.inputWrap}>
                          <Building2 size={18} className={styles.inputIcon} />
                          <input 
                            type="text" 
                            id="businessName" 
                            className={styles.input} 
                            placeholder="e.g. Accra Tech Wave & Events Ltd" 
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <motion.button 
                        type="submit" 
                        className={styles.submitBtn} 
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
                        <ArrowRight size={18} />
                      </motion.button>
                    </motion.form>
                  )}

                </AnimatePresence>
              </div>

              <div className={styles.authPrompt}>
                Already have an account? 
                <Link href="/login">Log In</Link>
              </div>
            </>
          )}

        </div>
      </div>

    </div>
  );
}
