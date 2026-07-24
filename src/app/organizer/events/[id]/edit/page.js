"use client";

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Calendar, 
  MapPin, 
  Tag, 
  Ticket, 
  DollarSign, 
  Image as ImageIcon,
  CheckCircle,
  Eye
} from 'lucide-react';
import styles from './EditEvent.module.css';

const CATEGORIES = [
  "Music & Concerts",
  "Technology & Innovation",
  "Arts & Culture",
  "Business & Networking",
  "Food & Drink",
  "Comedy & Entertainment",
  "Sports & Fitness",
  "Other"
];

export default function EditEventPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const eventId = params.id;

  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: eventId === "1" ? "Neon Nights Festival" : eventId === "2" ? "Comedy Cellar" : "Digital Art Gallery",
    category: eventId === "1" ? "Music & Concerts" : eventId === "2" ? "Comedy & Entertainment" : "Arts & Culture",
    description: "Join us for an immersive night of music, art, and vibrant lights with top performers and creators across the region.",
    venue: "Independence Square",
    city: "Accra",
    startDate: "2026-08-15",
    startTime: "18:00",
    endDate: "2026-08-16",
    endTime: "02:00",
    status: eventId === "1" ? "Live" : eventId === "2" ? "Ended" : "Draft",
    imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop"
  });

  const [ticketTiers, setTicketTiers] = useState([
    { id: 1, name: 'Regular Entry', price: 80, quantity: 800, sold: 650 },
    { id: 2, name: 'VIP Pass', price: 200, quantity: 200, sold: 190 }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateTier = (id, field, value) => {
    setTicketTiers(prev => prev.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const handleAddTier = () => {
    const newId = ticketTiers.length > 0 ? Math.max(...ticketTiers.map(t => t.id)) + 1 : 1;
    setTicketTiers([
      ...ticketTiers,
      { id: newId, name: 'VVIP Pass', price: 350, quantity: 50, sold: 0 }
    ]);
  };

  const handleRemoveTier = (id) => {
    setTicketTiers(prev => prev.filter(tier => tier.id !== id));
  };

  const handleSave = async (targetStatus) => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSubmitting(false);
    alert(`Event details for "${formData.title}" saved successfully! Status: ${targetStatus || formData.status}`);
    router.push('/organizer/events');
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <Link href="/organizer/events" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Events
          </Link>
          <div className={styles.headerTitle} style={{ marginTop: '0.5rem' }}>
            <h1>Edit Event #{eventId}</h1>
            <span className={`${styles.statusBadge} ${styles[formData.status.toLowerCase()]}`}>
              {formData.status}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Link href="/organizer/events/preview" style={{ textDecoration: 'none' }}>
            <button className={styles.saveDraftBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} /> Preview
            </button>
          </Link>
          <button 
            className={styles.saveLiveBtn}
            onClick={() => handleSave(formData.status)}
            disabled={isSubmitting}
          >
            <Save size={18} /> {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className={styles.tabsRow}>
        <button 
          className={`${styles.tab} ${activeTab === 'general' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('general')}
        >
          General Information
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'tickets' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('tickets')}
        >
          Ticket Tiers & Pricing
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'media' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('media')}
        >
          Media & Banner
        </button>
      </div>

      {activeTab === 'general' && (
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.formGrid}>
            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Event Title</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={(e) => handleInputChange('title', e.target.value)} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Category</label>
              <select 
                value={formData.category} 
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Event Status</label>
              <select 
                value={formData.status} 
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="Live">Live (Publicly Listed)</option>
                <option value="Draft">Draft (Hidden)</option>
                <option value="Ended">Ended (Closed)</option>
              </select>
            </div>

            <div className={styles.inputGroup}>
              <label>Venue Name</label>
              <input 
                type="text" 
                value={formData.venue} 
                onChange={(e) => handleInputChange('venue', e.target.value)} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>City / Location</label>
              <input 
                type="text" 
                value={formData.city} 
                onChange={(e) => handleInputChange('city', e.target.value)} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Start Date</label>
              <input 
                type="date" 
                value={formData.startDate} 
                onChange={(e) => handleInputChange('startDate', e.target.value)} 
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Start Time</label>
              <input 
                type="time" 
                value={formData.startTime} 
                onChange={(e) => handleInputChange('startTime', e.target.value)} 
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <label>Event Description</label>
              <textarea 
                rows={5} 
                value={formData.description} 
                onChange={(e) => handleInputChange('description', e.target.value)} 
              />
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'tickets' && (
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: '#38bdf8' }}>Configure Ticket Tiers</h2>

          {ticketTiers.map((tier) => (
            <div key={tier.id} className={styles.tierCard}>
              <div className={styles.inputGroup}>
                <label>Tier Name</label>
                <input 
                  type="text" 
                  value={tier.name} 
                  onChange={(e) => handleUpdateTier(tier.id, 'name', e.target.value)} 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Price (GH₵)</label>
                <input 
                  type="number" 
                  value={tier.price} 
                  onChange={(e) => handleUpdateTier(tier.id, 'price', Number(e.target.value))} 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Total Seats</label>
                <input 
                  type="number" 
                  value={tier.quantity} 
                  onChange={(e) => handleUpdateTier(tier.id, 'quantity', Number(e.target.value))} 
                />
              </div>

              <button className={styles.deleteBtn} onClick={() => handleRemoveTier(tier.id)}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button className={styles.addTierBtn} onClick={handleAddTier}>
            <Plus size={18} /> Add Ticket Tier
          </button>
        </motion.div>
      )}

      {activeTab === 'media' && (
        <motion.div 
          className={styles.formCard}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#38bdf8' }}>Cover Image</h2>
          <div className={styles.inputGroup}>
            <label>Image URL</label>
            <input 
              type="text" 
              value={formData.imageUrl} 
              onChange={(e) => handleInputChange('imageUrl', e.target.value)} 
            />
          </div>
          {formData.imageUrl && (
            <div style={{ marginTop: '1.5rem', borderRadius: '12px', overflow: 'hidden', maxHeight: '300px' }}>
              <img src={formData.imageUrl} alt="Event Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
