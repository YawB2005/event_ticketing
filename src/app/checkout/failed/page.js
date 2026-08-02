"use client";

import Link from 'next/link';
import styles from './Failed.module.css';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

export default function CheckoutFailedPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <AlertTriangle size={42} />
        </div>

        <h1 className={styles.title}>Payment Unsuccessful</h1>
        <p className={styles.subtitle}>
          Your transaction could not be processed by the payment provider. No funds were debited from your account.
        </p>

        <Link href="/events" className={styles.btnPrimary}>
          <RefreshCw size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
          Try Checkout Again
        </Link>

        <Link href="/events" className={styles.btnSecondary}>
          <ArrowLeft size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'text-bottom' }} />
          Back to Browse Events
        </Link>
      </div>
    </div>
  );
}
