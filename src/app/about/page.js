"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Ticket, Sparkles, Shield, Zap } from "lucide-react";
import styles from "./About.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const STEPS = [
  {
    icon: Search,
    title: "Discover an event",
    description: "Browse upcoming concerts, festivals, tech meetups, and more on our events page.",
  },
  {
    icon: Ticket,
    title: "Select and purchase a ticket",
    description: "Choose your ticket type, review your order, and checkout securely online.",
  },
  {
    icon: Sparkles,
    title: "Attend and enjoy",
    description: "Receive your electronic ticket with QR code and enjoy a seamless entry experience.",
  },
];

const BENEFITS = [
  {
    icon: Zap,
    title: "Easy event discovery",
    description: "Search and filter events by category, location, and price to find what you love.",
  },
  {
    icon: Ticket,
    title: "Convenient ticketing",
    description: "Purchase tickets online in minutes with electronic delivery to your account.",
  },
  {
    icon: Shield,
    title: "Secure transactions",
    description: "Payments are processed through trusted third-party gateways for your peace of mind.",
  },
  {
    icon: Sparkles,
    title: "Simple user experience",
    description: "A clean, responsive interface designed for both first-time and returning users.",
  },
];

export default function AboutPage() {
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
            About ETSP
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.7, delay: 0.15 }}
            className={styles.heroSubtitle}
          >
            The Event Ticketing and Showcasing Platform — your gateway to discovering and
            experiencing world-class events.
          </motion.p>
        </div>
      </section>

      {/* About the Platform */}
      <section className={styles.section} aria-labelledby="about-heading">
        <div className="container">
          <div className={styles.twoCol}>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6 }}
            >
              <h2 id="about-heading" className={styles.sectionTitle}>
                About the platform
              </h2>
              <p className={styles.bodyText}>
                ETSP (Event Ticketing and Showcasing Platform) is a web-based platform that
                connects event organizers with attendees. Organizers can create, publish, and
                manage events while selling tickets online, and attendees can browse, discover,
                and purchase tickets with electronic delivery.
              </p>
              <p className={styles.bodyText}>
                Whether you are looking for live music, tech conferences, art exhibitions, or
                comedy shows, ETSP makes it easy to find events and secure your spot.
              </p>
            </motion.div>
            <motion.div
              className={styles.missionCard}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h2 className={styles.missionTitle}>Our mission</h2>
              <p className={styles.missionText}>
                To replace fragmented event promotion and manual ticketing with a unified
                digital ecosystem — making event discovery effortless and ticket purchasing
                secure and convenient for everyone.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.sectionAlt} aria-labelledby="how-heading">
        <div className="container">
          <motion.h2
            id="how-heading"
            className={`${styles.sectionTitle} ${styles.centered}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            How it works
          </motion.h2>
          <div className={styles.stepsGrid}>
            {STEPS.map((step, index) => (
              <motion.div
                key={step.title}
                className={styles.stepCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={styles.stepNumber}>{index + 1}</div>
                <div className={styles.stepIcon} aria-hidden="true">
                  <step.icon size={28} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.section} aria-labelledby="benefits-heading">
        <div className="container">
          <motion.h2
            id="benefits-heading"
            className={`${styles.sectionTitle} ${styles.centered}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Why choose ETSP
          </motion.h2>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                className={styles.benefitCard}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <div className={styles.benefitIcon} aria-hidden="true">
                  <benefit.icon size={24} />
                </div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaBg} />
        <div className={`container ${styles.ctaContent}`}>
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            Ready to explore?
          </motion.h2>
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover upcoming events and find your next unforgettable experience.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
