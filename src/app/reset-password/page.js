"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { resetPassword } from "@/lib/api/auth";
import {
  validatePassword,
  validatePasswordMatch,
  PASSWORD_RULES,
  getPasswordStrength,
} from "@/lib/validation";
import styles from "./reset-password.module.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordError = validatePassword(password);
    const confirmError = validatePasswordMatch(password, confirmPassword);
    const newErrors = {};
    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      setSubmitError("This reset link is invalid or has expired.");
      return;
    }

    if (loading) return;

    setLoading(true);
    setSubmitError(null);
    setErrors({});

    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className={styles.errorBox} role="alert">
        <AlertCircle size={48} aria-hidden="true" />
        <h2 className={styles.title}>Invalid reset link</h2>
        <p className={styles.subtitle}>
          This password reset link is invalid or has expired. Please request a new one.
        </p>
        <Link href="/forgot-password" className={styles.submitBtn} style={{ display: "block", textAlign: "center" }}>
          Request New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.successBox} role="status">
        <h2 className={styles.title}>Password updated</h2>
        <p className={styles.subtitle}>
          Your password has been successfully changed. You can now log in with your new password.
        </p>
        <Link href="/login" className={styles.submitBtn} style={{ display: "block", textAlign: "center" }}>
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <>
      <motion.h2 variants={fadeUp} className={styles.title}>
        Create a New Password
      </motion.h2>
      <motion.p variants={fadeUp} className={styles.subtitle}>
        Enter a strong password for your account. Make sure it meets all the requirements below.
      </motion.p>

      <form onSubmit={handleSubmit} noValidate>
        <motion.div variants={fadeUp} className={styles.formGroup}>
          <label htmlFor="password">New Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: null }));
                setSubmitError(null);
              }}
              aria-invalid={!!errors.password}
              aria-describedby="password-requirements"
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <span className={styles.errorMsg} role="alert">
              {errors.password}
            </span>
          )}

          {password && (
            <div className={styles.strengthBar} aria-hidden="true">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`${styles.strengthSegment} ${strength >= level ? styles[`strength${level}`] : ""}`}
                />
              ))}
            </div>
          )}

          <ul id="password-requirements" className={styles.requirements}>
            {PASSWORD_RULES.map((rule) => {
              const passed = password && rule.test(password);
              return (
                <li key={rule.id} className={passed ? styles.reqPassed : styles.reqFailed}>
                  {passed ? <Check size={14} aria-hidden="true" /> : <X size={14} aria-hidden="true" />}
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirmPassword: null }));
              }}
              aria-invalid={!!errors.confirmPassword}
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className={styles.errorMsg} role="alert">
              {errors.confirmPassword}
            </span>
          )}
          {confirmPassword && password && confirmPassword !== password && (
            <span className={styles.errorMsg} role="alert">
              Passwords do not match.
            </span>
          )}
        </motion.div>

        {submitError && (
          <div className={styles.submitError} role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{submitError}</span>
            {submitError.includes("expired") && (
              <Link href="/forgot-password" className={styles.inlineLink}>
                Request a new reset link
              </Link>
            )}
          </div>
        )}

        <motion.button
          variants={fadeUp}
          type="submit"
          className={styles.submitBtn}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.magicSide}>
        <div className={styles.wavyBg} />
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={styles.star}
          style={{ top: "10%", left: "25%" }}
        >
          ✦
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.6, scale: 1.2 }}
          transition={{ delay: 0.6 }}
          className={styles.star}
          style={{ bottom: "15%", left: "15%" }}
        >
          ✦
        </motion.div>

        <motion.div
          className={styles.magicShape}
          initial={{ opacity: 0, y: 50, rotate: 5 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          <h1 className={styles.magicText}>
            New <br /> beginnings
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

          <Suspense fallback={<p className={styles.subtitle}>Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
