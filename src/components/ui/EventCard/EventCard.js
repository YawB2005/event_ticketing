import Image from 'next/image';
import Link from 'next/link';
import styles from './EventCard.module.css';

export default function EventCard({ event, onClick }) {
  const CardContent = (
    <>
      <div className={styles.imageContainer}>
        {/* Using a solid color or gradient as fallback if image isn't available */}
        <div className={styles.imagePlaceholder} style={{ background: event.color || 'var(--bg-tertiary)' }}>
          <span className={styles.category}>{event.category}</span>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.dateInfo}>
          <span className={styles.month}>{event.month}</span>
          <span className={styles.day}>{event.day}</span>
        </div>
        <div className={styles.details}>
          <h3 className={styles.title}>{event.title}</h3>
          {event.organizer && <p className={styles.organizer}>Hosted by {event.organizer}</p>}
          <p className={styles.location}>{event.location}</p>
          <div className={styles.footer}>
            <span className={styles.price}>{event.price}</span>
            <span className={styles.availability}>{event.availability}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div className={styles.card} onClick={() => onClick(event)} style={{ cursor: 'pointer' }}>
        {CardContent}
      </div>
    );
  }

  return (
    <Link href={`/events/${event.id}`} className={styles.card}>
      {CardContent}
    </Link>
  );
}
