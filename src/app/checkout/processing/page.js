"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Check, Loader2, ShieldCheck } from 'lucide-react';
import styles from './CheckoutProcessing.module.css';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get('title') || 'Neon Nights Music Festival 2026';
  const qty = searchParams.get('qty') || '2';
  const total = searchParams.get('total') || '95.50';
  const provider = searchParams.get('provider') || 'Mobile Money';
  const email = searchParams.get('email') || 'customer@example.com';
  const name = searchParams.get('name') || 'Valued Attendee';

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Step 1 -> Step 2 after 1.2s
    const t1 = setTimeout(() => setStepIndex(1), 1200);
    // Step 2 -> Step 3 after 2.4s
    const t2 = setTimeout(() => setStepIndex(2), 2400);
    // Redirect to Success page after 3.6s
    const t3 = setTimeout(() => {
      const query = new URLSearchParams({
        ref: `TK-${Math.floor(10000 + Math.random() * 90000)}-2026`,
        title,
        qty,
        total,
        provider,
        email,
        name
      }).toString();
      router.push(`/checkout/success?${query}`);
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [router, title, qty, total, provider, email, name]);

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.spinnerWrapper}>
          <div className={styles.outerRing}></div>
          <CreditCard size={32} className={styles.innerIcon} />
        </div>

        <h1 className={styles.title}>Processing Payment</h1>
        <p className={styles.subtitle}>
          Authorizing <strong style={{ color: '#fff' }}>GH₵ {total}</strong> via {provider}...
        </p>

        <div className={styles.statusList}>
          <div className={`${styles.statusStep} ${stepIndex > 0 ? styles.done : stepIndex === 0 ? styles.active : ''}`}>
            <div className={styles.stepDot}>
              {stepIndex > 0 ? <Check size={12} /> : '1'}
            </div>
            <span>Connecting to payment gateway</span>
          </div>

          <div className={`${styles.statusStep} ${stepIndex > 1 ? styles.done : stepIndex === 1 ? styles.active : ''}`}>
            <div className={styles.stepDot}>
              {stepIndex > 1 ? <Check size={12} /> : '2'}
            </div>
            <span>Verifying transaction authorization</span>
          </div>

          <div className={`${styles.statusStep} ${stepIndex === 2 ? styles.active : ''}`}>
            <div className={styles.stepDot}>
              {stepIndex === 2 ? <Loader2 size={12} className="spin" /> : '3'}
            </div>
            <span>Issuing encrypted QR tickets</span>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2rem' }}>
          Please do not refresh or close this browser window.
        </p>
      </motion.div>
    </div>
  );
}

export default function CheckoutProcessingPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ color: '#fff' }}>Loading payment state...</p>
        </div>
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  );
}
