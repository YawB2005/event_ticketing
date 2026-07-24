"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactForm } from "@/lib/api/contact";
import { validateEmail, validateRequired, validateMessage } from "@/lib/validation";
import styles from "./Contact.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "support@etsp.example.com",
    href: "mailto:support@etsp.example.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 (0) XX XXX XXXX",
    href: null,
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Accra, Ghana",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
    setSubmitError(null);
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateRequired(form.name, "full name");
    const emailErr = validateEmail(form.email);
    const subjectErr = validateRequired(form.subject, "subject");
    const messageErr = validateMessage(form.message);

    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (subjectErr) newErrors.subject = subjectErr;
    if (messageErr) newErrors.message = messageErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || loading) return;

    setLoading(true);
    setSubmitError(null);

    try {
      await submitContactForm(form);
      setSuccess(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroWavyBg} />
        <div className={`container ${styles.heroContent}`}>
          <motion.h1
            className="font-serif"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7 }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.15 }}
            className={styles.heroSubtitle}
          >
            Have a question or need help? We would love to hear from you. Send us a message and
            we will get back to you as soon as possible.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={`container ${styles.grid}`}>
          {/* Contact Info */}
          <motion.div
            className={styles.infoCol}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.infoTitle}>Get in touch</h2>
            <p className={styles.infoDesc}>
              Reach out through any of the channels below, or fill out the form and our team
              will respond promptly.
            </p>
            <ul className={styles.infoList}>
              {CONTACT_INFO.map((item) => (
                <li key={item.label} className={styles.infoItem}>
                  <div className={styles.infoIcon} aria-hidden="true">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a href={item.href} className={styles.infoValue}>
                        {item.value}
                      </a>
                    ) : (
                      <span className={styles.infoValue}>{item.value}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <p className={styles.placeholderNote}>
              Contact details above are placeholders — replace with your team&apos;s actual
              information.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className={styles.formCol}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {success ? (
              <div className={styles.successBox} role="status">
                <CheckCircle size={48} aria-hidden="true" />
                <h3>Message sent!</h3>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  type="button"
                  className={styles.submitBtn}
                  onClick={() => setSuccess(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <span id="name-error" className={styles.errorMsg} role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <span id="email-error" className={styles.errorMsg} role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className={`${styles.input} ${errors.subject ? styles.inputError : ""}`}
                    placeholder="How can we help?"
                    value={form.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <span id="subject-error" className={styles.errorMsg} role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className={styles.errorMsg} role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                {submitError && (
                  <div className={styles.submitError} role="alert">
                    <AlertCircle size={18} aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button type="submit" className={styles.submitBtn} disabled={loading}>
                  {loading ? (
                    <>
                      <span className={styles.btnSpinner} aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} aria-hidden="true" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
