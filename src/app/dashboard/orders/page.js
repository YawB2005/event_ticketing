"use client";

import { motion } from 'framer-motion';
import { ShoppingBag, CreditCard, Download, CheckCircle2, Ticket } from 'lucide-react';
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
        <p className={styles.subText}>View receipts, transaction references, and payment details for all registered passes.</p>
      </div>

      <motion.div 
        className={styles.card} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Event Title</th>
                <th>Purchase Date</th>
                <th>Pass Type</th>
                <th>Payment Method</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td className={styles.orderId}>{order.id}</td>
                  <td style={{ fontWeight: 700, color: '#ffffff' }}>{order.event}</td>
                  <td style={{ color: 'rgba(252, 248, 242, 0.7)' }}>{order.date}</td>
                  <td>{order.items}</td>
                  <td style={{ color: 'rgba(252, 248, 242, 0.7)' }}>{order.paymentMethod}</td>
                  <td style={{ fontWeight: 800, color: '#ffb703' }}>{order.total}</td>
                  <td>
                    <span className={styles.statusCompleted}>
                      <CheckCircle2 size={14} />
                      <span>{order.status}</span>
                    </span>
                  </td>
                  <td>
                    <button 
                      className={styles.receiptBtn} 
                      onClick={() => showAlert(`Downloading PDF receipt for order ${order.id}`, "info", "Download Started")}
                    >
                      <Download size={14} /> PDF
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
