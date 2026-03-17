"use client";
import React, { useState, useEffect } from 'react';
import { Button, Progress } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useStyles } from './styles';

// --- Interfaces ---
interface BaseItem { label: string; }
interface ProgressItem extends BaseItem { score: number; }
interface QuizItem extends BaseItem { score: number; date: string; }
interface AlertItem extends BaseItem { desc: string; }

interface CardData {
  id: number;
  type: "progress" | "quiz" | "alert";
  title: string;
  value?: string;
  detail?: string;
  color: string;
  items: (ProgressItem | QuizItem | AlertItem)[];
}

const CARDS: CardData[] = [
  { 
    id: 1, 
    type: "progress",
    title: "Overall Progress Score", 
    value: "78%", 
    detail: "5% this week", 
    color: "#00d2df",
    items: [{ label: "Mathematics", score: 82 }, { label: "Physical Sciences", score: 65 }] as ProgressItem[]
  },
  { 
    id: 2, 
    type: "quiz",
    title: "Recent Quiz Results", 
    color: "#52c41a",
    items: [
      { label: "Linear Equations", score: 85, date: "Today" },
      { label: "Cell Structure", score: 92, date: "Yesterday" }
    ] as QuizItem[]
  },
  { 
    id: 3, 
    type: "alert",
    title: "Recent Alerts", 
    color: "#faad14",
    items: [{ label: "Struggling with Life Sciences", desc: "Your last two scores were below 50% regarding Cell Structure." }] as AlertItem[]
  }
];

export default function UbuntuLearn() {
  const { styles } = useStyles();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % CARDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.swooshContainer}>
        <svg width="100%" height="100%" viewBox="0 0 1440 800" fill="none">
          <defs>
            <linearGradient id="soft_grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#08F1C2" />
            </linearGradient>
          </defs>
          <path d="M-200 150 C 200 50, 700 250, 1600 50" stroke="url(#soft_grad)" strokeWidth="120" strokeOpacity="0.04" strokeLinecap="round" />
        </svg>
      </div>

      <nav className={styles.glassNav}>
        <a href="/login">Login</a>
        <a href="#">About</a>
        <a href="#">Contact Us</a>
      </nav>

      <div className={styles.brandSection}>
        <img src="https://firebasestorage.googleapis.com/v0/b/grade-12-life-sciences-st.firebasestorage.app/o/image.png?alt=media&token=7477da80-3128-4dc8-833b-92c432ea71b1" alt="Logo" className={styles.mainLogo} />
        <h1 className={styles.title}>Ubuntu Learn</h1>
        <p className={styles.subtitle}>Learn • Funda • Bala • Leer</p>
      </div>

      <div className={styles.actionSection}>
        <motion.img 
          src="https://firebasestorage.googleapis.com/v0/b/grade-12-life-sciences-st.firebasestorage.app/o/download.png?alt=media&token=c48ad801-ecfe-4435-9cf8-753a94ecc303" 
          className={styles.robotImg}
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div style={{ marginTop: 20 }}>
          <p className={styles.placeholderText}>
            Personalized learning paths designed to help you excel in your matric year and beyond.
          </p>
        </div>
      </div>

      <div className={styles.cardStackWrapper}>
        <AnimatePresence>
          {CARDS.map((card, i) => {
            const isActive = i === index;
            const isVisible = i === index || i === (index + 1) % CARDS.length || i === (index - 1 + CARDS.length) % CARDS.length;

            if (!isVisible) return null;

            let xOffset = 0;
            let rotation = 0;
            if (i === (index + 1) % CARDS.length) { xOffset = 200; rotation = 25; }
            else if (i === (index - 1 + CARDS.length) % CARDS.length) { xOffset = -200; rotation = -25; }

            return (
              <motion.div
                key={card.id}
                className={styles.glassCard}
                animate={{ 
                  opacity: isActive ? 1 : 0.2, 
                  x: xOffset, 
                  rotate: rotation,
                  zIndex: isActive ? 10 : 5,
                  scale: isActive ? 1 : 0.85
                }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              >
                <div className={styles.cardHeader}>
                   <span className={styles.cardHeaderTitle}>{card.title}</span>
                   {card.detail && <span className={styles.trendLabel}>↗ {card.detail}</span>}
                </div>

                <div>
                  {card.type === "progress" && (
                    <>
                      <h2 className={styles.cardValue}>{card.value}</h2>
                      {card.items.map((item, idx) => (
                        <div key={idx} className={styles.listItem}>
                          <div className={styles.itemInfo}>
                            <span>{item.label}</span>
                            <span>{(item as ProgressItem).score}%</span>
                          </div>
                          <Progress percent={(item as ProgressItem).score} showInfo={false} strokeColor={card.color} size="small" />
                        </div>
                      ))}
                    </>
                  )}

                  {card.type === "quiz" && (
                    <div className={styles.quizList}>
                      {card.items.map((item, idx) => {
                        const qItem = item as QuizItem;
                        return (
                          <div key={idx}>
                            <div className={styles.quizInfo}>
                              <span className={styles.quizLabel}>{qItem.label}</span>
                              <span className={styles.quizScore} style={{ color: qItem.score < 70 ? '#faad14' : '#52c41a' }}>
                                {qItem.score}%
                              </span>
                            </div>
                            <span className={styles.quizDate}>{qItem.date}</span>
                            <Progress percent={qItem.score} showInfo={false} strokeColor={qItem.score < 70 ? '#faad14' : '#52c41a'} strokeWidth={4} />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {card.type === "alert" && (
                    <div className={styles.alertBox}>
                       <div className={styles.alertHeader}>
                         <div className={styles.alertIcon} style={{ background: card.color }}>!</div>
                         <strong>{card.items[0].label}</strong>
                       </div>
                       <p className={styles.alertDesc}>{(card.items[0] as AlertItem).desc}</p>
                    </div>
                  )}
                </div>
                
                {card.type === "quiz" && <div className={styles.viewAll}>View All Results →</div>}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}