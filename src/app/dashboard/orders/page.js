"use client";

import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Download, CheckCircle } from 'lucide-react';
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
import styles from './PurchaseHistory.module.css';

export default function PurchaseHistoryPage() {
  const { showAlert } = useAlert();
  const orders = [
    {
      id: 'ORD-9901',
      event: 'Neon Nights Music Festival',
      date: 'Jul 24, 2026',
      items: '1x VIP Pass',
      paymentMethod: 'MTN Mobile Money',
      total: 'GH₵ 200.00',
      status: 'Paid'
    },
    {
      id: 'ORD-9902',
      event: 'Global Tech Summit 2026',
      date: 'Jul 22, 2026',
      items: '1x General Admission',
      paymentMethod: 'Visa / Mastercard',
      total: 'GH₵ 299.00',
      status: 'Paid'
    },
    {
      id: 'ORD-9844',
      event: 'Digital Art & NFT Gallery',
      date: 'Jun 15, 2026',
      items: '1x Free Entry Pass',
      paymentMethod: 'Free Access',
      total: 'GH₵ 0.00',
      status: 'Paid'
    }
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Purchase & Order History</h1>
        <p className={styles.subText}>View receipts, transaction references, and payment methods for all registered tickets.</p>
      </div>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order Ref</th>
              <th>Event</th>
              <th>Purchase Date</th>
              <th>Items</th>
              <th>Payment Method</th>
              <th>Total Paid</th>
              <th>Status</th>
              <th>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className={styles.orderId}>{order.id}</td>
                <td style={{ fontWeight: 600, color: '#ffffff' }}>{order.event}</td>
                <td style={{ color: '#94a3b8' }}>{order.date}</td>
                <td>{order.items}</td>
                <td style={{ color: '#cbd5e1' }}>{order.paymentMethod}</td>
                <td style={{ fontWeight: 700, color: '#ffffff' }}>{order.total}</td>
                <td>
                  <span className={styles.statusCompleted}>✓ {order.status}</span>
                </td>
                <td>
                  <button className={styles.receiptBtn} onClick={() => showAlert(`Downloading receipt for ${order.id}`, "info", "Download Started")}>
                    <Download size={14} style={{ display: 'inline', marginRight: '4px' }} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
