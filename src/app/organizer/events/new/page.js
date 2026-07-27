"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Check, 
  Calendar, 
  MapPin, 
  Tag, 
  Plus, 
  Trash2, 
  Upload, 
  Sparkles, 
  DollarSign, 
  Ticket,
  Clock
} from 'lucide-react';
import styles from './CreateEvent.module.css';

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

const fadeVariant = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Music & Concerts',
    description: '',
    venue: '',
    city: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    imageUrl: '',
  });

  // Ticket Tiers State
  const [ticketTiers, setTicketTiers] = useState([
    { id: 1, name: 'General Admission', price: 50, quantity: 200, salesStart: '', salesEnd: '' },
    { id: 2, name: 'VIP Pass', price: 150, quantity: 50, salesStart: '', salesEnd: '' }
  ]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTier = () => {
    const newId = ticketTiers.length > 0 ? Math.max(...ticketTiers.map(t => t.id)) + 1 : 1;
    setTicketTiers([
      ...ticketTiers,
      { id: newId, name: 'New Ticket Tier', price: 0, quantity: 100, salesStart: '', salesEnd: '' }
    ]);
  };

  const handleUpdateTier = (id, field, value) => {
    setTicketTiers(prev => prev.map(tier => 
      tier.id === id ? { ...tier, [field]: value } : tier
    ));
  };

  const handleRemoveTier = (id) => {
    if (ticketTiers.length === 1) {
      alert("You must have at least one ticket tier.");
      return;
    }
    setTicketTiers(prev => prev.filter(tier => tier.id !== id));
  };

  const handlePublish = async (status = "Live") => {
    setIsSubmitting(true);
    // Simulate Supabase API save delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert(`Event "${formData.title || 'Untitled Event'}" has been successfully saved as ${status}!`);
    router.push('/organizer/events');
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Link href="/organizer/events" className={styles.backBtn}>
            <ArrowLeft size={18} /> Back to My Events
          </Link>
          <h1 className={styles.title}>Create New Event</h1>
          <p className={styles.subtitle}>Fill in event details and configure ticket tiers for your audience</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <div className={styles.stepper}>
        <div 
          className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''} ${currentStep > 1 ? styles.completed : ''}`}
          onClick={() => setCurrentStep(1)}
        >
          <div className={styles.stepNumber}>{currentStep > 1 ? <Check size={18} /> : '1'}</div>
          <span className={styles.stepLabel}>Event Details</span>
        </div>

        <div className={styles.stepDivider}></div>

        <div 
          className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''} ${currentStep > 2 ? styles.completed : ''}`}
          onClick={() => setCurrentStep(2)}
        >
          <div className={styles.stepNumber}>{currentStep > 2 ? <Check size={18} /> : '2'}</div>
          <span className={styles.stepLabel}>Ticket Tiers</span>
        </div>

        <div className={styles.stepDivider}></div>

        <div 
          className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`}
          onClick={() => setCurrentStep(3)}
        >
          <div className={styles.stepNumber}>3</div>
          <span className={styles.stepLabel}>Review & Publish</span>
        </div>
      </div>

      {/* Form Content Card */}
      <div className={styles.card}>
        <AnimatePresence mode="wait">
          {/* STEP 1: EVENT DETAILS */}
          {currentStep === 1 && (
            <motion.div 
              key="step1"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.sectionTitle}>General Information</h2>
              <p className={styles.sectionSubtitle}>Set the core details for your upcoming event</p>

              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="title">Event Title *</label>
                  <input 
                    type="text" 
                    id="title"
                    className={styles.input} 
                    placeholder="e.g. Accra Tech Summit 2026"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category">Category *</label>
                  <select 
                    id="category"
                    className={styles.select}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="venue">Venue / Location *</label>
                  <input 
                    type="text" 
                    id="venue"
                    className={styles.input} 
                    placeholder="e.g. Accra International Conference Centre"
                    value={formData.venue}
                    onChange={(e) => handleInputChange('venue', e.target.value)}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Start Date & Time *</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="date" 
                      id="startDate"
                      className={styles.input}
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                    <input 
                      type="time" 
                      className={styles.input}
                      value={formData.startTime}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="endDate">End Date & Time</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="date" 
                      id="endDate"
                      className={styles.input}
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                    <input 
                      type="time" 
                      className={styles.input}
                      value={formData.endTime}
                      onChange={(e) => handleInputChange('endTime', e.target.value)}
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label htmlFor="description">Event Description</label>
                  <textarea 
                    id="description"
                    className={styles.textarea} 
                    placeholder="Describe what attendees can expect, schedule highlights, special guests..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>

                {/* Banner Image URL / Picker */}
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Event Cover Image</label>
                  <div className={styles.imageUploadBox} onClick={() => {
                    const sampleUrl = '/images/tech_summit.png';
                    handleInputChange('imageUrl', sampleUrl);
                  }}>
                    {formData.imageUrl ? (
                      <div>
                        <img src={formData.imageUrl} alt="Cover Preview" className={styles.imagePreview} />
                        <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <div className={styles.uploadIcon}><Upload size={24} /></div>
                        <p style={{ fontWeight: 600, color: '#0f172a' }}>Click to select cover banner image</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Recommended format: 16:9 ratio PNG or JPG</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.actionsRow}>
                <div></div>
                <button 
                  className={styles.btnPrimary}
                  onClick={() => {
                    if (!formData.title) {
                      alert("Please enter an event title before continuing.");
                      return;
                    }
                    setCurrentStep(2);
                  }}
                >
                  Continue to Ticket Tiers
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TICKET TIERS */}
          {currentStep === 2 && (
            <motion.div 
              key="step2"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.sectionTitle}>Ticket Configuration</h2>
              <p className={styles.sectionSubtitle}>Define pricing options and ticket allocation for your event</p>

              {ticketTiers.map((tier, idx) => (
                <div key={tier.id} className={styles.tierCard}>
                  <div className={styles.tierHeader}>
                    <span className={styles.tierTitle}>Tier #{idx + 1}: {tier.name || 'Untitled Tier'}</span>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleRemoveTier(tier.id)}
                      title="Remove Tier"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Tier Name *</label>
                      <input 
                        type="text" 
                        className={styles.input}
                        placeholder="e.g. VIP Access, Early Bird"
                        value={tier.name}
                        onChange={(e) => handleUpdateTier(tier.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Price (GH₵) *</label>
                      <input 
                        type="number" 
                        className={styles.input}
                        placeholder="0 for Free"
                        value={tier.price}
                        onChange={(e) => handleUpdateTier(tier.id, 'price', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Quantity Available *</label>
                      <input 
                        type="number" 
                        className={styles.input}
                        placeholder="e.g. 100"
                        value={tier.quantity}
                        onChange={(e) => handleUpdateTier(tier.id, 'quantity', parseInt(e.target.value, 10) || 0)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>Sales End Date</label>
                      <input 
                        type="date" 
                        className={styles.input}
                        value={tier.salesEnd}
                        onChange={(e) => handleUpdateTier(tier.id, 'salesEnd', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button className={styles.addTierBtn} onClick={handleAddTier}>
                <Plus size={18} /> Add Another Ticket Tier
              </button>

              <div className={styles.actionsRow}>
                <button className={styles.btnSecondary} onClick={() => setCurrentStep(1)}>
                  Back
                </button>
                <button className={styles.btnPrimary} onClick={() => setCurrentStep(3)}>
                  Review & Publish
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: REVIEW & PUBLISH */}
          {currentStep === 3 && (
            <motion.div 
              key="step3"
              variants={fadeVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.sectionTitle}>Review Event Details</h2>
              <p className={styles.sectionSubtitle}>Double check your event specifications before going live</p>

              <div className={styles.reviewBox}>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Event Title</span>
                  <span className={styles.reviewValue}>{formData.title || 'Untitled Event'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Category</span>
                  <span className={styles.reviewValue}>{formData.category}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Venue / Location</span>
                  <span className={styles.reviewValue}>{formData.venue || 'Not specified'}</span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Date & Time</span>
                  <span className={styles.reviewValue}>
                    {formData.startDate || 'TBD'} {formData.startTime && `@ ${formData.startTime}`}
                  </span>
                </div>
                <div className={styles.reviewRow}>
                  <span className={styles.reviewLabel}>Total Capacity</span>
                  <span className={styles.reviewValue}>
                    {ticketTiers.reduce((acc, t) => acc + (t.quantity || 0), 0)} Tickets
                  </span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>Configured Ticket Tiers</h3>
              {ticketTiers.map(t => (
                <div key={t.id} className={styles.reviewBox} style={{ marginBottom: '0.75rem', padding: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                    <span>{t.name}</span>
                    <span style={{ color: '#4f46e5' }}>GH₵ {t.price} ({t.quantity} qty)</span>
                  </div>
                </div>
              ))}

              <div className={styles.actionsRow}>
                <button className={styles.btnSecondary} onClick={() => setCurrentStep(2)}>
                  Back
                </button>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    className={styles.btnSecondary}
                    onClick={() => handlePublish('Draft')}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </button>
                  <button 
                    className={styles.btnPrimary}
                    onClick={() => handlePublish('Live')}
                    disabled={isSubmitting}
                  >
                    <Sparkles size={18} /> {isSubmitting ? 'Publishing...' : 'Publish Event Live'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
