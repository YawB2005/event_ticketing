import styles from './Checkout.module.css';

const mockOrder = {
  eventId: '1',
  eventTitle: 'Neon Nights Music Festival 2026',
  date: 'August 15, 2026',
  tickets: [
    { type: 'General Admission', qty: 2, price: 45.00 }
  ],
  subtotal: 90.00,
  fees: 5.50,
  total: 95.50
};

export default function Checkout({ params }) {
  const order = mockOrder;

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <p>Complete your purchase to secure your tickets.</p>
      </div>

      <div className={styles.mainGrid}>
        {/* Left Col: Payment Details */}
        <div className={styles.paymentCol}>
          <div className={`glass-panel ${styles.panel}`}>
            <h2>Contact Information</h2>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number (for SMS ticket)</label>
              <input type="tel" placeholder="+1 (555) 000-0000" className={styles.input} />
            </div>
          </div>

          <div className={`glass-panel ${styles.panel}`}>
            <h2>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <label className={`${styles.paymentOption} ${styles.selected}`}>
                <input type="radio" name="payment" defaultChecked />
                <span>Credit/Debit Card</span>
              </label>
              <label className={styles.paymentOption}>
                <input type="radio" name="payment" />
                <span>Mobile Money</span>
              </label>
            </div>

            <div className={styles.cardDetails}>
              <div className={styles.formGroup}>
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className={styles.input} />
              </div>
              <div className={styles.rowGrid}>
                <div className={styles.formGroup}>
                  <label>Expiry (MM/YY)</label>
                  <input type="text" placeholder="MM/YY" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>CVC</label>
                  <input type="text" placeholder="123" className={styles.input} />
                </div>
              </div>
            </div>
          </div>

          <button className={`btn btn-primary ${styles.payBtn}`}>Pay ${order.total.toFixed(2)}</button>
        </div>

        {/* Right Col: Order Summary */}
        <div className={styles.summaryCol}>
          <div className={`glass-panel ${styles.summaryPanel}`}>
            <h2>Order Summary</h2>
            <div className={styles.eventInfo}>
              <h3>{order.eventTitle}</h3>
              <p>{order.date}</p>
            </div>
            
            <div className={styles.lineItems}>
              {order.tickets.map((ticket, idx) => (
                <div key={idx} className={styles.lineItem}>
                  <span>{ticket.qty}x {ticket.type}</span>
                  <span>${(ticket.qty * ticket.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Fees</span>
                <span>${order.fees.toFixed(2)}</span>
              </div>
              <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
