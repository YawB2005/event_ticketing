"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { requestPasswordReset } from "@/lib/api/auth";
import { validateEmail } from "@/lib/validation";
import styles from "./forgot-password.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset(email.trim());
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.magicSide}>
        <div className={styles.wavyBg} />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.star}
          style={{ top: "15%", left: "20%" }}
        >
          ✦
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.5, scale: 0.8 }}
          transition={{ delay: 0.4 }}
          className={styles.star}
          style={{ top: "25%", right: "15%", color: "#000" }}
        >
          ✦
        </motion.div>

        <motion.div
          className={styles.magicShape}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <h1 className={styles.magicText}>
            Reset <br /> your access
          </h1>
        </motion.div>
      </div>

      <div className={styles.formSide}>
        <motion.div
          className={styles.formWrapper}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
          }}
        >
          <motion.div variants={fadeUp}>
            <Link
              href="/login"
              style={{ display: "inline-block", marginBottom: "2rem", fontWeight: 600, color: "#888" }}
            >
              ← Back to Login
            </Link>
          </motion.div>

          {success ? (
            <motion.div variants={fadeUp} className={styles.successBox} role="status">
              <h2 className={styles.title}>Check your email</h2>
              <p className={styles.subtitle}>
                If an account exists for <strong>{email}</strong>, we have sent password reset
                instructions. Please check your inbox and follow the link to create a new password.
              </p>
              <p className={styles.securityNote}>
                For your security, we cannot confirm whether this email is registered.
              </p>
              <Link href="/login" className={styles.submitBtn} style={{ display: "block", textAlign: "center" }}>
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.h2 variants={fadeUp} className={styles.title}>
                Forgot your password?
              </motion.h2>
              <motion.p variants={fadeUp} className={styles.subtitle}>
                Enter the email address associated with your account and we will send you a link
                to reset your password.
              </motion.p>

              <form onSubmit={handleSubmit} noValidate>
                <motion.div variants={fadeUp} className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    className={`${styles.input} ${error ? styles.inputError : ""}`}
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? "email-error" : undefined}
                  />
                  {error && (
                    <span id="email-error" className={styles.errorMsg} role="alert">
                      {error}
                    </span>
                  )}
                </motion.div>

                <motion.button
                  variants={fadeUp}
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </form>

              <motion.div variants={fadeUp} className={styles.backPrompt}>
                Remember your password?
                <Link href="/login">Log in</Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
