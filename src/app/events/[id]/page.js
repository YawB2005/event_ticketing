import styles from './EventDetail.module.css';
import Link from 'next/link';

// Mock fetching data based on ID
const mockEvent = {
  id: '1',
  title: 'Neon Nights Music Festival 2026',
  date: 'August 15, 2026',
  time: '6:00 PM - 2:00 AM',
  location: 'Cyber Arena, Downtown',
  description: 'Experience the ultimate electronic music festival of the year. Featuring top DJs from around the world, mind-blowing visual effects, and an unforgettable atmosphere.',
  category: 'Music',
  color: 'linear-gradient(135deg, #FF007A 0%, #7928CA 100%)',
  organizer: 'Rave Culture Ltd',
  ticketTypes: [
    { id: 't1', name: 'General Admission', price: 45.00, available: true, maxQty: 4 },
    { id: 't2', name: 'VIP Pass', price: 120.00, available: true, maxQty: 2, benefits: 'Includes fast-track entry, exclusive lounge access, and 2 complimentary drinks.' },
    { id: 't3', name: 'Early Bird', price: 30.00, available: false, maxQty: 0 }
  ]
};

export default function EventDetail({ params }) {
  // In a real app, use params.id to fetch the event
  const event = mockEvent;

  return (
    <div className={styles.page}>
      {/* Event Header Hero */}
      <div className={styles.hero} style={{ background: event.color }}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className={styles.categoryBadge}>{event.category}</span>
            <h1 className={styles.title}>{event.title}</h1>
            <p className={styles.subtitle}>{event.date} &bull; {event.location}</p>
          </div>
        </div>
      </div>

      <div className={`container ${styles.mainGrid}`}>
        {/* Left Column: Details */}
        <div className={styles.detailsCol}>
          <section className={styles.section}>
            <h2>About this Event</h2>
            <p className={styles.description}>{event.description}</p>
          </section>

          <section className={styles.section}>
            <h2>When & Where</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <h3>Date & Time</h3>
                <p>{event.date}</p>
                <p>{event.time}</p>
              </div>
              <div className={styles.infoItem}>
                <h3>Location</h3>
                <p>{event.location}</p>
              </div>
            </div>
          </section>
          
          <section className={styles.section}>
            <h2>Organizer</h2>
            <div className={styles.organizerCard}>
              <div className={styles.organizerAvatar}>RC</div>
              <div>
                <h3>{event.organizer}</h3>
                <p>3 past events</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Ticket Selection */}
        <div className={styles.ticketCol}>
          <div className={`glass-panel ${styles.ticketCard}`}>
            <h2>Select Tickets</h2>
            <div className={styles.ticketList}>
              {event.ticketTypes.map(ticket => (
                <div key={ticket.id} className={`${styles.ticketType} ${!ticket.available ? styles.soldOut : ''}`}>
                  <div className={styles.ticketInfo}>
                    <h4>{ticket.name}</h4>
                    {ticket.benefits && <p className={styles.ticketBenefits}>{ticket.benefits}</p>}
                    <p className={styles.ticketPrice}>
                      {ticket.available ? `$${ticket.price.toFixed(2)}` : 'Sold Out'}
                    </p>
                  </div>
                  {ticket.available && (
                    <div className={styles.quantitySelector}>
                      <select defaultValue={0}>
                        {[...Array(ticket.maxQty + 1).keys()].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className={styles.checkoutSection}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>$0.00</span>
              </div>
              <Link href={`/checkout/${event.id}`} className={`btn btn-primary ${styles.checkoutBtn}`}>
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
