"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Ticket, 
  ShieldCheck, 
  Zap, 
  Compass
} from 'lucide-react';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/ui/LoadingSpinner/LoadingSpinner';
import styles from './page.module.css';

// Curtain Drop-down Animation for Hero
const curtainReveal = {
  hidden: { y: "-80px", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } 
  }
};

// Curtain Drop-down Animation for Hero Elements
const curtainDrop = {
  hidden: { y: "-70px", opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

// Left-to-Right Slide Animation on Scroll
const slideInLeft = {
  hidden: { opacity: 0, x: -75 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

// Right-to-Left Slide Animation on Scroll
const slideInRight = {
  hidden: { opacity: 0, x: 75 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } 
  }
};

// Staggered Fade Up
const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 1.3, ease: [0.22, 1, 0.36, 1] }
  }
};

// Pop Scale In
const popIn = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function Home() {
  const router = useRouter();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Interactive state
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [audienceMode, setAudienceMode] = useState('attendee');

  useEffect(() => {
    async function fetchFeaturedEvents() {
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        
        const data = await res.json();
        
        const formatted = data.map(evt => {
          const dateObj = evt.start_datetime ? new Date(evt.start_datetime) : null;
          let priceStr = "Free";
          let minPrice = 0;

          if (evt.ticket_types && evt.ticket_types.length > 0) {
            const prices = evt.ticket_types.map(t => parseFloat(t.price));
            minPrice = Math.min(...prices);
            priceStr = minPrice === 0 ? "Free" : `GH₵ ${minPrice.toLocaleString()}`;
          }

          return {
            id: evt.id,
            title: evt.title,
            image: evt.banner_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            date: dateObj ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA',
            time: dateObj ? dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : 'TBA',
            location: evt.venue_name ? `${evt.venue_name}, ${evt.city || ''}` : evt.city || 'TBA',
            price: priceStr,
            category: evt.category || 'General',
            description: evt.description
          };
        });

        setEvents(formatted);
      } catch (err) {
        console.error('Error loading events for homepage:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFeaturedEvents();
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let query = searchQuery;
    if (locationQuery) query += ` ${locationQuery}`;
    if (query.trim()) {
      router.push(`/events?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/events');
    }
  };

  // Base events pool (real events from DB or rich sample dataset if DB has no events yet)
  const defaultDemoEvents = [
    {
      id: 'demo-1',
      title: 'Accra Tech Summit & AI Expo 2025',
      image: '/images/collage_tech_summit.png',
      date: 'Sat, Oct 18, 2025',
      time: '9:00 AM',
      location: 'Kempinski Hotel Gold Coast City, Accra',
      price: 'GH₵ 150',
      category: 'Tech',
      description: 'Ghana’s premier technology conference bringing together AI researchers, founders, engineers, and digital innovators.'
    },
    {
      id: 'demo-2',
      title: 'Afrochella Cultural Music & Arts Festival',
      image: '/images/collage_arts_festival.png',
      date: 'Sun, Dec 28, 2025',
      time: '2:00 PM',
      location: 'El-Wak Sports Stadium, Accra',
      price: 'GH₵ 250',
      category: 'Arts',
      description: 'A celebration of African culture, food, fashion, and live musical performances by top continental artists.'
    },
    {
      id: 'demo-3',
      title: 'Highlife & Afrobeats Live Concert Night',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'Sat, Nov 15, 2025',
      time: '7:00 PM',
      location: 'National Theatre of Ghana, Accra',
      price: 'GH₵ 120',
      category: 'Music',
      description: 'An unforgettable evening of highlife classics and contemporary Afrobeats rhythms performed live.'
    },
    {
      id: 'demo-4',
      title: 'Stand-Up Comedy All-Stars Night',
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'Sat, Nov 1, 2025',
      time: '8:00 PM',
      location: 'Accra International Conference Centre',
      price: 'GH₵ 80',
      category: 'Comedy',
      description: 'Non-stop hilarious comedy performances by top national comedians and guest comedy stars.'
    },
    {
      id: 'demo-5',
      title: 'Midnight Glow Rooftop Lounge & Party',
      image: '/images/cta_general_event_bg.png',
      date: 'Fri, Nov 7, 2025',
      time: '10:00 PM',
      location: 'Skybar 25, Airport City',
      price: 'GH₵ 90',
      category: 'Nightlife',
      description: 'Vibrant rooftop nightlife with live DJ sets, neon lighting, craft cocktails, and VIP table service.'
    },
    {
      id: 'demo-6',
      title: 'City International Marathon & Health Expo',
      image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      date: 'Sun, Nov 23, 2025',
      time: '6:00 AM',
      location: 'Independence Square, Accra',
      price: 'Free',
      category: 'Sports',
      description: 'Join thousands of runners in the annual city marathon, featuring health booths and fitness challenges.'
    }
  ];

  const poolEvents = events.length > 0 ? events : defaultDemoEvents;

  // Filter events dynamically based on active category tab
  const displayEvents = selectedCategory === 'All' 
    ? poolEvents 
    : poolEvents.filter(evt => evt.category && evt.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className={styles.page}>
      
      {/* 1. HERO SECTION (Curtain Reveal Animation) */}
      <section className={styles.hero}>
        <motion.div 
          className={styles.heroContent}
          variants={curtainReveal} 
          initial="hidden" 
          animate="visible"
        >
          
          {/* Main Headline - Curtain Drop */}
          <motion.h1 
            className={styles.heroTitle}
            variants={curtainDrop} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            Your Next Event <br/> Starts Here
          </motion.h1>

          <motion.p 
            className={styles.heroSubtitle}
            variants={curtainDrop} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          >
            From tech summits to cultural festivals, sports marathons to nightlife, discover, book, and secure your spot in just a few clicks.
          </motion.p>

          {/* Interactive Glassmorphism Search Bar - Curtain Drop */}
          <motion.form 
            className={styles.searchContainer} 
            onSubmit={handleSearchSubmit}
            variants={curtainDrop} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          >
            <div className={styles.searchSection}>
              <Search size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="Search tech summits, festivals, sports, or shows..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.searchDivider}></div>

            <div className={styles.searchSection}>
              <MapPin size={20} className={styles.searchIcon} />
              <input 
                type="text" 
                placeholder="City or venue location..." 
                className={styles.searchInput}
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>

            <motion.button 
              type="submit" 
              className={styles.searchBtn}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 28px rgba(232, 93, 4, 0.6)' }}
              whileTap={{ scale: 0.96 }}
            >
              <span>Explore Events</span>
              <ArrowRight size={18} className={styles.searchBtnArrow} />
            </motion.button>
          </motion.form>

          {/* Quick Trust Stats - Curtain Drop */}
          <motion.div 
            className={styles.heroStats}
            variants={curtainDrop} 
            initial="hidden" 
            animate="visible" 
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
          >
            <div className={styles.statItem}>
              <Ticket size={18} style={{ color: '#ff6b2c' }} />
              <span><strong>Trusted</strong> Ticketing Source</span>
            </div>
            <div className={styles.statItem}>
              <ShieldCheck size={18} style={{ color: '#ff6b2c' }} />
              <span><strong>100%</strong> Verified QR Gate Access</span>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 2. FLOATING GRADIENT TICKER MARQUEE (Moving Left to Right) */}
      <div className={styles.tickerWrapper}>
        <motion.div 
          className={styles.tickerContainer}
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className={styles.tickerTrack}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <div className={styles.tickerItem}>GET A TICKET <span className={styles.tickerStar}>✦</span></div>
                <div className={styles.tickerItem}>TECH SUMMITS & EXPOS <span className={styles.tickerStar}>✦</span></div>
                <div className={styles.tickerItem}>ARTS & CULTURAL FESTIVALS <span className={styles.tickerStar}>✦</span></div>
                <div className={styles.tickerItem}>INSTANT QR CHECK-IN <span className={styles.tickerStar}>✦</span></div>
                <div className={styles.tickerItem}>UNFORGETTABLE EXPERIENCES <span className={styles.tickerStar}>✦</span></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 2. PLATFORM VALUE PROPOSITION (Scroll Animations: Left to Right & Right to Left) */}
      <section className={`${styles.section} ${styles.valueSection}`}>
        <div className={styles.container}>
          <div className={styles.valueGrid}>
            
            {/* Left to Right Slide Animation */}
            <motion.div 
              className={styles.valueText}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={slideInLeft}
            >
              <h2>We make it easy to find and book tickets for any event.</h2>
              <p>
                Our platform is built to give you a fast, secure, and hassle-free way to discover tech conferences, sports, cultural festivals, comedy shows, and workshops near you.
              </p>

              <div className={styles.valueFeatures}>
                <motion.div 
                  className={styles.featureCard}
                  whileHover={{ x: 6, borderColor: 'rgba(255, 107, 44, 0.35)', boxShadow: '0 12px 25px rgba(0, 0, 0, 0.06)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.featureIcon}>
                    <Zap size={22} />
                  </div>
                  <h4>Instant E-Tickets</h4>
                  <p>Get your digital QR tickets delivered instantly to your email and account dashboard.</p>
                </motion.div>

                <motion.div 
                  className={styles.featureCard}
                  whileHover={{ x: 6, borderColor: 'rgba(255, 107, 44, 0.35)', boxShadow: '0 12px 25px rgba(0, 0, 0, 0.06)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.featureIcon}>
                    <ShieldCheck size={22} />
                  </div>
                  <h4>Secure Checkout</h4>
                  <p>Encrypted payment processing with instant booking confirmation guaranteed.</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Right to Left Slide Animation */}
            <motion.div 
              className={styles.valueVisual}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true, margin: "-100px" }} 
              variants={slideInRight}
            >
              <div className={styles.editorialCollage}>
                <motion.img 
                  src="/images/collage_tech_summit.png" 
                  alt="Tech Summits & Conferences" 
                  className={styles.collageImg1}
                  initial={{ opacity: 0, scale: 0.9, y: 35 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                  whileHover={{ scale: 1.04, rotate: -1 }}
                />
                <motion.img 
                  src="/images/collage_arts_festival.png" 
                  alt="Arts & Cultural Festivals" 
                  className={styles.collageImg2}
                  initial={{ opacity: 0, scale: 0.9, y: 45 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
                  whileHover={{ scale: 1.04, rotate: 1 }}
                />
                <motion.div 
                  className={styles.collageBadge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
                  whileHover={{ scale: 1.08 }}
                >
                  <span>99.9%</span>
                  <p>Guaranteed Entry</p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. RECENT & FEATURED EVENTS GRID (TERRACOTTA THEME) */}
      <section className={`${styles.section} ${styles.eventsSection}`}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <motion.h2 
              className={styles.sectionTitle}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
            >
              Recent & Trending Events
            </motion.h2>
            <motion.p 
              className={styles.sectionSubtitle}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              transition={{ delay: 0.1 }}
            >
              Check out top recommended events happening in your area.
            </motion.p>
          </div>

          {/* Interactive Category Filter Tabs with Micro-Animations */}
          <div className={styles.categoryTabs}>
            {['All', 'Music', 'Tech', 'Arts', 'Comedy', 'Nightlife', 'Sports'].map((cat) => (
              <motion.button 
                key={cat}
                className={`${styles.tabBtn} ${selectedCategory === cat ? styles.tabBtnActive : ''}`}
                onClick={() => setSelectedCategory(cat)}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ duration: 0.15 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Events Grid with Hover Lift Effects */}
          <div className={styles.eventGrid}>
            {loading ? (
              <div style={{ gridColumn: '1 / -1', padding: '3rem 0' }}>
                <LoadingSpinner text="Loading events..." />
              </div>
            ) : displayEvents.length > 0 ? (
              displayEvents.map((evt, idx) => (
                <motion.div 
                  key={evt.id}
                  initial="hidden" 
                  whileInView="visible" 
                  viewport={{ once: true, margin: "-40px" }} 
                  variants={fadeUp} 
                  transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: idx * 0.14 }}
                  whileHover={{ y: -10 }}
                >
                  <Link href={`/events/${evt.id}`} className={styles.eventCard}>
                    <div className={styles.cardImgWrap}>
                      <img src={evt.image} alt={evt.title} className={styles.cardImg} />
                      <span className={styles.categoryTag}>{evt.category}</span>
                      <span className={styles.priceTag}>{evt.price}</span>
                    </div>

                    <div className={styles.cardBody}>
                      <h3 className={styles.cardTitle}>{evt.title}</h3>
                      
                      <div className={styles.cardMeta}>
                        <div className={styles.metaRow}>
                          <Calendar size={16} className={styles.metaIcon} />
                          <span>{evt.date} • {evt.time}</span>
                        </div>
                        <div className={styles.metaRow}>
                          <MapPin size={16} className={styles.metaIcon} />
                          <span>{evt.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.cardFooter}>
                      <button className={styles.buyBtn}>
                        <span>Get Ticket</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', padding: '3.5rem 1rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.8)' }}>
                <p style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>No events currently listed under <strong>"{selectedCategory}"</strong>.</p>
                <button 
                  className={styles.tabBtnActive} 
                  onClick={() => setSelectedCategory('All')}
                  style={{ padding: '10px 24px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Show All Events
                </button>
              </div>
            )}
          </div>

          {/* View All Events Action */}
          <div className={styles.viewAllWrap}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/events" className={styles.viewAllBtn}>
                <span>Explore All Events</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 4. SIMPLE BOOKING FROM SEARCH TO SEAT (Alternating Left & Right Animations) */}
      <section className={`${styles.section} ${styles.howItWorksSection}`}>
        <div className={styles.container}>
          
          <div className={styles.sectionHeader}>
            <motion.h2 
              className={styles.sectionTitle}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
            >
              Simple Booking From Search to Seat
            </motion.h2>
            <motion.p 
              className={styles.sectionSubtitle}
              initial="hidden" 
              whileInView="visible" 
              viewport={{ once: true }} 
              variants={fadeUp} 
              transition={{ delay: 0.1 }}
            >
              Discover events, pick your seat, and book securely in minutes.
            </motion.p>
          </div>

          {/* Dual Toggle: Attendees vs Organizers */}
          <div className={styles.toggleContainer}>
            <div className={styles.toggleTrack}>
              <button 
                className={`${styles.toggleBtn} ${audienceMode === 'attendee' ? styles.toggleActive : ''}`}
                onClick={() => setAudienceMode('attendee')}
              >
                For Attendees
              </button>
              <button 
                className={`${styles.toggleBtn} ${audienceMode === 'organizer' ? styles.toggleActive : ''}`}
                onClick={() => setAudienceMode('organizer')}
              >
                For Event Organizers
              </button>
            </div>
          </div>

          {/* Steps Grid with Alternating Slide Animations */}
          <div className={styles.stepsGrid}>
            {audienceMode === 'attendee' ? (
              <>
                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInLeft}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>01</div>
                  <h3 className={styles.stepTitle}>Find Your Event</h3>
                  <p className={styles.stepDesc}>Browse concerts, sports, theater, or search by event name, date, or city location.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInRight}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>02</div>
                  <h3 className={styles.stepTitle}>Choose Your Ticket</h3>
                  <p className={styles.stepDesc}>Select from General Admission, VIP pass, or Early Bird tiers with real-time seat availability.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInLeft}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>03</div>
                  <h3 className={styles.stepTitle}>Book Securely</h3>
                  <p className={styles.stepDesc}>Pay online with mobile money or card with instant order confirmation guaranteed.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInRight}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>04</div>
                  <h3 className={styles.stepTitle}>Get Your E-Ticket</h3>
                  <p className={styles.stepDesc}>Receive digital QR tickets directly via app or email. Show code at the venue gate for instant scanning.</p>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInLeft}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>01</div>
                  <h3 className={styles.stepTitle}>Create Your Event</h3>
                  <p className={styles.stepDesc}>Set up event details, upload banner artwork, and set custom venue locations in under 3 minutes.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInRight}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>02</div>
                  <h3 className={styles.stepTitle}>Configure Ticket Tiers</h3>
                  <p className={styles.stepDesc}>Create Early Bird, VIP, or Regular ticket tiers with custom pricing and capacity limits.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInLeft}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>03</div>
                  <h3 className={styles.stepTitle}>Sell & Track Sales</h3>
                  <p className={styles.stepDesc}>Monitor real-time ticket sales, revenue analytics, and attendee registrations on your organizer portal.</p>
                </motion.div>

                <motion.div 
                  className={styles.stepCard} 
                  initial="hidden" whileInView="visible" viewport={{ once: true }} 
                  variants={slideInRight}
                  transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                  whileHover={{ y: -8, boxShadow: '0 18px 35px rgba(0, 0, 0, 0.08)' }}
                >
                  <div className={styles.stepNum}>04</div>
                  <h3 className={styles.stepTitle}>Scan Tickets at Gate</h3>
                  <p className={styles.stepDesc}>Use our built-in QR Scanner app to validate attendee entry in under 1 second per guest.</p>
                </motion.div>
              </>
            )}
          </div>

        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <motion.h2 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp}
          >
            LET'S GET YOU TO THE SHOW
          </motion.h2>

          <motion.p 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp} 
            transition={{ delay: 0.1 }}
          >
            From concerts to festivals, the best nights start here. Host your event or secure your ticket and make it unforgettable.
          </motion.p>

          <motion.div 
            className={styles.ctaButtons}
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            variants={fadeUp} 
            transition={{ delay: 0.2 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/organizer" className={styles.btnPrimary}>
                <span>Host an Event</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/events" className={styles.btnSecondary}>
                <span>Explore Events</span>
                <Compass size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
