"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Processing.module.css';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const eventId = searchParams.get('eventId');

  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 1200);
    const timer2 = setTimeout(() => setStepIndex(2), 2500);

    const redirectTimer = setTimeout(() => {
      if (reference) {
        router.push(`/orders/${reference}/success`);
      } else if (eventId) {
        router.push(`/checkout/${eventId}`);
      } else {
        router.push('/dashboard/tickets');
      }
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(redirectTimer);
    };
  }, [reference, eventId, router]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.pulsingGlow}></div>
          <LoadingSpinner text="" />
        </div>

        <h1 className={styles.title}>Processing Your Order</h1>
        <p className={styles.subtitle}>
          Please hold tight while we confirm your Paystack transaction and generate your digital pass QR code.
        </p>

        <div className={styles.steps}>
          <div className={`${styles.stepItem} ${stepIndex >= 0 ? styles.stepDone : ''}`}>
            <CheckCircle2 size={18} color={stepIndex >= 0 ? '#ffb703' : 'rgba(255,255,255,0.3)'} />
            <span>Communicating with Paystack gateway...</span>
          </div>

          <div className={`${styles.stepItem} ${stepIndex >= 1 ? styles.stepDone : ''}`}>
            <CheckCircle2 size={18} color={stepIndex >= 1 ? '#ffb703' : 'rgba(255,255,255,0.3)'} />
            <span>Reserving ticket allocation & gate pass...</span>
          </div>

          <div className={`${styles.stepItem} ${stepIndex >= 2 ? styles.stepDone : ''}`}>
            <CheckCircle2 size={18} color={stepIndex >= 2 ? '#ffb703' : 'rgba(255,255,255,0.3)'} />
            <span>Generating cryptographic QR verification pass...</span>
          </div>
        </div>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'rgba(252, 248, 242, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={16} color="#ff6b2c" /> Do not close or refresh this browser tab
        </p>
      </div>
    </div>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0c0502', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner text="Processing..." />
      </div>
    }>
      <ProcessingContent />
    </Suspense>
  );
}
