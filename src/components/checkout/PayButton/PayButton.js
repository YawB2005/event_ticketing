'use client';

import { useRouter } from 'next/navigation';
import { saveOrder } from '@/lib/checkout/orderStorage';
import styles from './PayButton.module.css';

export default function PayButton({ order, paymentMethod = 'Credit/Debit Card' }) {
  const router = useRouter();

  const handlePay = () => {
    saveOrder({
      eventId: order.eventId,
      eventName: order.eventTitle,
      ticketType: order.tickets.map((t) => t.type).join(', '),
      quantity: order.tickets.reduce((sum, t) => sum + t.qty, 0),
      amountPaid: order.total,
      paymentMethod,
    });
    router.push('/checkout/processing');
  };

  return (
    <button type="button" className={`btn btn-primary ${styles.payBtn}`} onClick={handlePay}>
      Pay ${order.total.toFixed(2)}
    </button>
  );
}
