import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ExamSelectPage.module.css';

export const ExamSelectPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1>시험 유형 선택</h1>
      <div className={styles.buttonContainer}>
        <button 
          className={styles.examButton}
          onClick={() => navigate('/exam/sentence')}
        >
          문장 시험
        </button>
        <button 
          className={styles.examButton}
          onClick={() => navigate('/exam/word')}
        >
          단어 시험
        </button>
      </div>
    </div>
  );
};