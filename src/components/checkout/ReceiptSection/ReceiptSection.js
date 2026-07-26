import { formatCurrency } from '@/lib/checkout/formatters';
import styles from './ReceiptSection.module.css';

const FIELDS = [
  { key: 'eventName', label: 'Event Name' },
  { key: 'ticketType', label: 'Ticket Type' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'amountPaid', label: 'Amount Paid', format: formatCurrency },
  { key: 'transactionId', label: 'Transaction ID' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'purchaseDate', label: 'Purchase Date' },
  { key: 'orderNumber', label: 'Order Number' },
];

export default function ReceiptSection({ receipt }) {
  return (
    <div className={`glass-panel ${styles.receipt}`}>
      <h2 className={styles.title}>Receipt</h2>
      <dl className={styles.list}>
        {FIELDS.map(({ key, label, format }) => (
          <div key={key} className={styles.row}>
            <dt>{label}</dt>
            <dd>{format ? format(receipt[key]) : receipt[key]}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
