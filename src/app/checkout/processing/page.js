'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProcessingLoader from '@/components/checkout/ProcessingLoader/ProcessingLoader';
import { PAYMENT_CONFIG } from '@/lib/checkout/paymentConfig';
import { buildReceipt } from '@/lib/checkout/mockData';
import { getOrder, saveReceipt } from '@/lib/checkout/orderStorage';
import styles from './Processing.module.css';

export default function ProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const { processingDelayMs, simulateSuccess } = PAYMENT_CONFIG;
    const start = Date.now();
    let frame;

    const tick = () => {
      const elapsed = Date.now() - start;
      const next = Math.min((elapsed / processingDelayMs) * 100, 100);
      setProgress(next);

      if (elapsed < processingDelayMs) {
        frame = requestAnimationFrame(tick);
      } else {
        const order = getOrder();
        if (simulateSuccess) {
          saveReceipt(buildReceipt(order));
          router.replace('/checkout/success');
        } else {
          router.replace('/checkout/failed');
        }
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [router]);

  return (
    <div className={`container ${styles.page}`}>
      <motion.div
        className={`glass-panel ${styles.card}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProcessingLoader progress={progress} />
        <h1 className={styles.heading}>Processing your payment...</h1>
        <p className={styles.subtext}>
          Please do not close or refresh this page while we confirm your transaction.
        </p>
      </motion.div>
    </div>
  );
}
