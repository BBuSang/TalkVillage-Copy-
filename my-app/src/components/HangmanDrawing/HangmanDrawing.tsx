import React from 'react';
import styles from './HangmanDrawing.module.css';

interface HangmanDrawingProps {
  remainingAttempts: number;
}

const HangmanDrawing: React.FC<HangmanDrawingProps> = ({ remainingAttempts }) => {
  return (
    <div className={styles.hangmanContainer}>
      {/* "7" 모양 기둥 */}
      <div className={styles.verticalPole} />
      <div className={styles.horizontalPole} />
      <div className={styles.rope} />

      {/* 행맨 파트 */}
      <div className={`${styles.head} ${remainingAttempts <= 5 ? styles.visible : ''}`} />
      <div className={`${styles.body} ${remainingAttempts <= 4 ? styles.visible : ''}`} />
      <div className={`${styles.armLeft} ${remainingAttempts <= 3 ? styles.visible : ''}`} />
      <div className={`${styles.armRight} ${remainingAttempts <= 2 ? styles.visible : ''}`} />
      <div className={`${styles.legLeft} ${remainingAttempts <= 1 ? styles.visible : ''}`} />
      <div className={`${styles.legRight} ${remainingAttempts === 0 ? styles.visible : ''}`} />
    </div>
  );
};

export default HangmanDrawing;
