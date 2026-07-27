"use client";

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import styles from './CheckoutFailed.module.css';

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason') || 'Transaction was declined by payment gateway or Mobile Money prompt expired.';

  return (
    <div className={styles.container}>
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.failedIconBadge}>
          <AlertCircle size={44} />
        </div>

        <h1 className={styles.title}>Payment Could Not Be Processed</h1>
        <p className={styles.subtitle}>
          Your card or Mobile Money account was not charged.
        </p>

        <div className={styles.errorBox}>
          <strong>Reason:</strong> {reason}
        </div>

        <div className={styles.actions}>
          <Link href="/checkout/1" className={styles.btnPrimary}>
            <RefreshCw size={18} /> Retry Payment
          </Link>
          <Link href="/events/1" className={styles.btnSecondary}>
            <ArrowLeft size={18} /> Back to Event
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={
      <div className={styles.container}>
        <div className={styles.card}>
          <p style={{ color: '#fff' }}>Loading...</p>
        </div>
      </div>
    }>
      <FailedContent />
    </Suspense>
  );
}
