"use client";

import styles from './page.module.css';
import Link from 'next/link';
import EventCard from '@/components/ui/EventCard/EventCard';
import { motion } from 'framer-motion';

const mockEvents = [
  {
    id: 1,
    title: "Global Tech Summit 2024",
    date: "Aug 15, 2024",
    month: "Aug",
    day: "15",
    location: "Moscone Center, SF",
    price: "From GH₵ 299",
    category: "Technology",
    availability: "Filling Fast",
    color: "#e0e7ff"
  },
  {
    id: 2,
    title: "Neon Nights Music Festival",
    date: "Sep 02, 2024",
    month: "Sep",
    day: "02",
    location: "Downtown Arena",
    price: "From GH₵ 89",
    category: "Music",
    availability: "Available",
    color: "#fdf4ff"
  },
  {
    id: 3,
    title: "Digital Art & NFT Gallery",
    date: "Oct 10, 2024",
    month: "Oct",
    day: "10",
    location: "Virtual Experience",
    price: "Free Entry",
    category: "Arts",
    availability: "Unlimited",
    color: "#f0fdf4"
  }
];

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export default function Home() {
  return (
    <div className={styles.page}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroWavyBg}></div>
        
        {/* Scattered Stars */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.5 }} className={`${styles.star} ${styles.star1}`}>✦</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.6 }} className={`${styles.star} ${styles.star2}`}>✦</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.7 }} className={`${styles.star} ${styles.star3}`}>✦</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.8 }} className={`${styles.star} ${styles.star4}`}>✧</motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.9 }} className={`${styles.star} ${styles.star5}`}>✦</motion.div>

        {/* Floating Shapes */}
        <motion.div 
          className={styles.shapeEight} 
          variants={popIn} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
        >
          8
        </motion.div>
        <motion.div 
          className={styles.shapeClover} 
          variants={popIn} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        ></motion.div>
        <motion.div 
          className={styles.shapePill} 
          variants={popIn} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
        ></motion.div>

        {/* Hand-drawn Arrow SVG */}
        <motion.div 
          className={styles.arrowDoodle}
          initial={{ opacity: 0, pathLength: 0 }} 
          animate={{ opacity: 0.8, pathLength: 1 }} 
          transition={{ duration: 1, delay: 1 }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <motion.path 
              d="M20,20 Q60,10 80,60 M80,60 L60,55 M80,60 L85,40" 
              initial={{ pathLength: 0 }} 
              animate={{ pathLength: 1 }} 
              transition={{ duration: 1, delay: 0.6 }} 
            />
          </svg>
        </motion.div>

        {/* Main Text Content */}
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            className="font-serif"
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8 }}
          >
            Exclusive <br/>
            events <br/>
            Priceless <br/>
            memories
          </motion.h1>
          
          <motion.div 
            variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/events" className="btn btn-primary" style={{ backgroundColor: '#2b00ff' }}>
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className={styles.section}>
        <div className={styles.sectionWavyBg}></div>
        <div className="container">
          <div className={styles.sectionHeader}>
            <motion.h2 
              className={styles.sectionTitle}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} transition={{ duration: 0.6 }}
            >
              Featured <br/> events
              <span className={`${styles.star} absolute`}>✦</span>
            </motion.h2>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <Link href="/events" className={styles.viewAll}>
                View All <span>→</span>
              </Link>
            </motion.div>
          </div>
          <div className={styles.eventGrid}>
            {mockEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} 
                variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Vibe (Categories) */}
      <section className={styles.section} style={{ background: '#f8f9fa' }}>
        <div className={styles.sectionWavyBg}></div>
        <div className="container">
          <div className={styles.sectionHeader} style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '2rem' }}>
            <motion.h2 
              className={styles.sectionTitle}
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} transition={{ duration: 0.6 }}
            >
              Browse by vibe
            </motion.h2>
          </div>
          
          <div className={styles.categoryGrid}>
            {[
              { id: 'music', name: 'Music', styleClass: styles.catMusic, image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'tech', name: 'Tech', styleClass: styles.catTech, image: 'https://images.unsplash.com/photo-1540039155732-d674d6e120a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'arts', name: 'Arts', styleClass: styles.catArts, image: 'https://images.unsplash.com/photo-1533174000243-ea821bb4627b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
              { id: 'comedy', name: 'Comedy', styleClass: styles.catComedy, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
            ].map((cat, index) => (
              <motion.div
                key={cat.id}
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} 
                variants={popIn} transition={{ duration: 0.6, delay: 0.1 * index, type: "spring" }}
              >
                <Link href={`/events?category=${cat.id}`} className={`${styles.categoryCard} ${cat.styleClass}`}>
                  <div className={styles.categoryBg} style={{ backgroundImage: `url('${cat.image}')` }}></div>
                  <span>{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg}></div>
        <div className={`container ${styles.ctaContent}`}>
          <motion.h2 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
          >
            Host your own magic
          </motion.h2>
          <motion.p 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }}
          >
            Create an unforgettable event and start selling tickets in minutes with our premium platform.
          </motion.p>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/organizer" className="btn btn-primary" style={{ backgroundColor: '#000' }}>
              Sell Tickets Now
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
