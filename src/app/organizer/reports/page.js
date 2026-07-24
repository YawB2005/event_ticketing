"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Calendar,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import styles from './Reports.module.css';

export default function OrganizerReportsPage() {
  const [timeframe, setTimeframe] = useState('This Month');

  const financialSummary = [
    { label: 'Total Gross Revenue', value: 'GH₵ 81,510', color: '#38bdf8' },
    { label: 'Platform Fees (5%)', value: 'GH₵ 4,075.50', color: '#f43f5e' },
    { label: 'Net Payout Received', value: 'GH₵ 77,434.50', color: '#10b981' },
    { label: 'Pending Settlement', value: 'GH₵ 6,750.00', color: '#f59e0b' }
  ];

  const reportHistory = [
    { id: 'REP-2026-07', name: 'July 2026 Financial & Ticket Summary', date: 'Jul 24, 2026', gross: 'GH₵ 74,760', net: 'GH₵ 71,022', status: 'Completed' },
    { id: 'REP-2026-06', name: 'June 2026 Event Performance Report', date: 'Jun 30, 2026', gross: 'GH₵ 6,750', net: 'GH₵ 6,412.50', status: 'Completed' },
    { id: 'REP-2026-05', name: 'May 2026 Event Performance Report', date: 'May 31, 2026', gross: 'GH₵ 0', net: 'GH₵ 0', status: 'Completed' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Financial & Sales Reports</h1>
          <p className={styles.subText}>Download detailed revenue breakdowns, tax summaries, and payout receipts</p>
        </div>

        <div className={styles.dateFilter}>
          {['This Week', 'This Month', 'This Year', 'All Time'].map((item) => (
            <button 
              key={item} 
              className={`${styles.filterBtn} ${timeframe === item ? styles.activeFilter : ''}`}
              onClick={() => setTimeframe(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summaryGrid}>
        {financialSummary.map((item, idx) => (
          <motion.div 
            key={idx}
            className={styles.card}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={styles.cardLabel}>{item.label}</div>
            <div className={styles.cardValue} style={{ color: item.color }}>{item.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className={styles.sectionCard}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className={styles.sectionHeader}>
          <h2>Monthly Report Statements</h2>
          <button className={styles.downloadBtn} onClick={() => alert("Downloading master report CSV...")}>
            <Download size={16} /> Download Master CSV
          </button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Report Name</th>
              <th>Date Generated</th>
              <th>Gross Revenue</th>
              <th>Net Payout</th>
              <th>Payout Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reportHistory.map((rep) => (
              <tr key={rep.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#38bdf8' }}>{rep.id}</td>
                <td style={{ fontWeight: 600, color: '#ffffff' }}>{rep.name}</td>
                <td style={{ color: '#94a3b8' }}>{rep.date}</td>
                <td style={{ fontWeight: 600 }}>{rep.gross}</td>
                <td style={{ color: '#10b981', fontWeight: 700 }}>{rep.net}</td>
                <td>
                  <span className={styles.statusCompleted}>{rep.status}</span>
                </td>
                <td>
                  <button className={styles.downloadBtn} onClick={() => alert(`Downloading ${rep.id} report PDF`)}>
                    <Download size={14} /> PDF
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
