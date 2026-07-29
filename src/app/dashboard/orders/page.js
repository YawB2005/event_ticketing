"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { getAttendeeOrders } from '@/utils/eventStore';
import styles from './PurchaseHistory.module.css';

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getAttendeeOrders());
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Purchase & Order History</h1>
        <p className={styles.subText}>View receipts, transaction references, and payment methods for all registered tickets.</p>
      </div>

      <motion.div className={styles.card} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.tableWrapper}>
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
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>{order.event}</td>
                  <td style={{ color: '#64748b' }}>{order.date}</td>
                  <td>{order.items}</td>
                  <td style={{ color: '#475569' }}>{order.paymentMethod}</td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{order.total}</td>
                  <td>
                    <span className={styles.statusCompleted}>✓ {order.status}</span>
                  </td>
                  <td>
                    <button className={styles.receiptBtn} onClick={() => alert(`Downloading receipt for ${order.id}`)}>
                      <Download size={14} style={{ display: 'inline', marginRight: '4px' }} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
