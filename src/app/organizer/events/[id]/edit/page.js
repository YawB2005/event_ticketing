"use client";

import { useState, use, useEffect } from 'react';
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
import { useAlert } from '@/components/ui/AlertModal/AlertContext';
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
  const { showAlert } = useAlert();
  const params = use(paramsPromise);
  const router = useRouter();
  const eventId = params.id;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    venue: "",
    city: "", // Optional/unused physically in DB but we map it to venue_name or just ignore
    startDate: "",
    startTime: "",
    status: "Draft",
    imageUrl: ""
  });

  const [ticketTiers, setTicketTiers] = useState([]);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/organizer/events/${eventId}`);
        if (!res.ok) throw new Error('Failed to load event data');
        const data = await res.json();
        
        let sDate = "";
        let sTime = "";
        if (data.start_datetime) {
           const d = new Date(data.start_datetime);
           sDate = d.toISOString().split('T')[0];
           sTime = d.toTimeString().split(' ')[0].substring(0, 5);
        }

        setFormData({
          title: data.title || "",
          category: data.category_id || "",
          description: data.description || "",
          venue: data.venue_name || "",
          city: "", 
          startDate: sDate,
          startTime: sTime,
          status: data.status === 'published' ? 'Live' : (data.status === 'draft' ? 'Draft' : 'Ended'),
          imageUrl: data.image_url || ""
        });

        if (data.ticket_types) {
          setTicketTiers(data.ticket_types.map(t => ({
            id: t.id,
            name: t.name,
            price: parseFloat(t.price || 0),
            quantity: t.quantity_total || 0,
            sold: t.quantity_sold || 0
          })));
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvent();
  }, [eventId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateTier = (id, field, value) => {
    setTicketTiers(prev => prev.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const handleAddTier = () => {
    const newId = `temp-${Date.now()}`;
    setTicketTiers([
      ...ticketTiers,
      { id: newId, name: 'New Ticket Tier', price: 0, quantity: 100, sold: 0 }
    ]);
  };

  const handleRemoveTier = (id) => {
    setTicketTiers(prev => prev.filter(tier => tier.id !== id));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Set immediate base64 data URL fallback so image always shows
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, imageUrl: event.target.result }));
    };
    reader.readAsDataURL(file);

    try {
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('event-banners')
        .upload(fileName, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('event-banners')
          .getPublicUrl(fileName);

        if (publicUrl) {
          setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
        }
      }
    } catch (err) {
      console.warn('Supabase storage upload error, using Data URL fallback:', err);
    }
  };

  const handleSave = async (targetStatus) => {
    setIsSubmitting(true);
    try {
      let start_datetime = null;
      if (formData.startDate && formData.startTime) {
         start_datetime = new Date(`${formData.startDate}T${formData.startTime}:00`).toISOString();
      }

      const res = await fetch(`/api/organizer/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          venue_name: formData.venue,
          start_datetime,
          status: targetStatus || formData.status,
          image_url: formData.imageUrl,
          category_id: formData.category || null,
          ticket_types: ticketTiers
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update event');

      showAlert(`Event saved successfully!`, 'success', 'Saved');
      router.push('/organizer/events');
    } catch (err) {
      console.error(err);
      showAlert(err.message, 'error', 'Error Saving');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading event details...</div>;
  if (error) return <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ef4444' }}>{error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <div>
          <Link href="/organizer/events" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Events
          </Link>
          <div className={styles.headerTitle} style={{ marginTop: '0.5rem' }}>
            <h1>Edit Event #{eventId.substring(0, 8)}...</h1>
            <span className={`${styles.statusBadge} ${styles[formData.status.toLowerCase()]}`}>
              {formData.status}
            </span>
          </div>
        </div>

        <div className={styles.headerActions}>
          <Link href={`/events/${eventId}`} style={{ textDecoration: 'none' }}>
            <button className={styles.saveDraftBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Eye size={18} /> View Live
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
            <label>Upload New Image</label>
            <input type="file" accept="image/*" onChange={handleFileUpload} />
          </div>
          <div className={styles.inputGroup}>
            <label>Or Image URL</label>
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
