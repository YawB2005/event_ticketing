'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, CreditCard, ArrowLeft, Home } from 'lucide-react';
import { FAILURE_REASONS } from '@/lib/checkout/mockData';
import { getOrder } from '@/lib/checkout/orderStorage';
import styles from './Failed.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function FailedPage() {
  const [checkoutUrl, setCheckoutUrl] = useState('/checkout/1');

  useEffect(() => {
    const order = getOrder();
    if (order?.eventId) setCheckoutUrl(`/checkout/${order.eventId}`);
  }, []);

  return (
    <div className={`container ${styles.page}`}>
      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <motion.div variants={fadeUp} className={styles.iconWrap}>
          <XCircle size={72} strokeWidth={1.5} />
        </motion.div>

        <motion.h1 variants={fadeUp} className={styles.heading}>Payment Failed</motion.h1>
        <motion.p variants={fadeUp} className={styles.message}>
          We couldn&apos;t complete your transaction. No charges were made to your account.
          Please try again or choose a different payment method.
        </motion.p>

        <motion.div variants={fadeUp} className={`glass-panel ${styles.reasons}`}>
          <h2>Common reasons this may happen</h2>
          <ul>
            {FAILURE_REASONS.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className={styles.actions}>
          <Link href="/checkout/processing" className={`btn btn-primary ${styles.btn}`}>
            <RefreshCw size={18} /> Try Again
          </Link>
          <Link href={checkoutUrl} className={`btn ${styles.btn} ${styles.btnSecondary}`}>
            <CreditCard size={18} /> Choose Another Payment Method
          </Link>
          <Link href={checkoutUrl} className={`btn ${styles.btn} ${styles.btnOutline}`}>
            <ArrowLeft size={18} /> Back to Checkout
          </Link>
          <Link href="/" className={`btn ${styles.btn} ${styles.btnGhost}`}>
            <Home size={18} /> Return Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
