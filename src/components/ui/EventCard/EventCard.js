import Image from 'next/image';
import Link from 'next/link';
import styles from './EventCard.module.css';

export default function EventCard({ event, onClick }) {
  const CardContent = (
    <>
      <div className={styles.imageContainer}>
        {event.image ? (
          <img src={event.image} alt={event.title} className={styles.eventImage} />
        ) : (
          <div className={styles.imagePlaceholder} style={{ background: event.color || '#f1f5f9' }}></div>
        )}
      </div>
      <div className={styles.content}>
        <span className={styles.availabilityPill}>{event.availability}</span>
        <h3 className={styles.title}>{event.title}</h3>
        <p className={styles.dateTime}>
          {event.date} • {event.time}
        </p>
        <p className={styles.location}>{event.location}</p>
        <p className={styles.price}>{event.price}</p>
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
