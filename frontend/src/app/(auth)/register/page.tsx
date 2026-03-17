"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { RegisterForm } from "@/components/auth/RegisterForm/RegisterForm";
import { useAuthActions, useAuthState } from "@/providers/auth";
import { IRegisterValues } from "@/providers/auth/context";
import { useStyles } from "../styles";

export default function RegisterPage() {
  const { styles } = useStyles();
  const { isLoading, isAuthenticated, errorMessage } = useAuthState();
  const { register, clearAuthError } = useAuthActions();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (values: IRegisterValues): Promise<void> => {
    // Map form values to the backend schema
    const payload: IRegisterValues = {
      ...values,
      isActive: true, // Always true as requested
      roleNames: [values.role], // Convert single select to array for backend
    };
    await register(payload);
  };

  return (
    <div className={styles.container}>
      <div className={styles.swooshContainer}>
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="soft_grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#08F1C2" />
            </linearGradient>
          </defs>
          <path d="M-200 150 C 200 50, 700 250, 1600 50" stroke="url(#soft_grad)" strokeWidth="120" strokeOpacity="0.04" strokeLinecap="round" />
        </svg>
      </div>

      <div className={styles.mainLayout}>
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
          <div className={styles.brandSection}>
            <img src="https://firebasestorage.googleapis.com/v0/b/grade-12-life-sciences-st.firebasestorage.app/o/image.png?alt=media&token=7477da80-3128-4dc8-833b-92c432ea71b1" alt="Logo" className={styles.mainLogo} />
            <h1 className={styles.title}>Ubuntu Learn</h1>
            <p className={styles.subtitle}>Learn • Funda • Bala • Leer</p>
          </div>
        </Link>

        <div className={styles.loginSection}>
          <motion.div 
            className={styles.formWrapper}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ maxWidth: '400px' }} // Slightly wider for more fields
          >
            <div className={styles.loginHeader}>
              <h2 className={styles.loginTitle}>Create Account</h2>
              <div className={styles.accentLine} />
            </div>

            <RegisterForm
              isLoading={isLoading}
              errorMessage={errorMessage}
              onSubmit={handleSubmit}
              onErrorDismiss={clearAuthError}
            />
            
            <div className={styles.footerActions}>
              <p>Already have an account? <Link href="/login" className={styles.regLink}>Sign In</Link></p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}