import React, { useState, useEffect } from 'react';
import { examService } from '../examService';
import styles from './ResultPanel.module.css';

interface ResultPanelProps {
  answers: string[];
  examType: 'sentence' | 'word';
}

export const ResultPanel: React.FC<ResultPanelProps> = ({ answers, examType }) => {
  const [score, setScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [examDetails, setExamDetails] = useState<Array<{
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>>([]);

  useEffect(() => {
    calculateScore();
  }, []);

  const calculateScore = async () => {
    try {
      let correctCount = 0;
      const details = [];
      
      for (let i = 0; i < answers.length; i++) {
        const exam = examType === 'sentence'
          ? await examService.getExamQuestion(i + 1)
          : await examService.getWordTestQuestion(i + 1);

        const isCorrect = exam.correctAnswer === answers[i];
        if (isCorrect) {
          correctCount++;
        }
        
        details.push({
          question: exam.examQuestion,
          userAnswer: answers[i],
          correctAnswer: exam.correctAnswer,
          isCorrect
        });
      }
      
      setScore((correctCount / answers.length) * 100);
      setExamDetails(details);
    } catch (error) {
      console.error('Failed to calculate score:', error);
    }
  };

  return (
    <div className={styles.panel}>
      <h2 className={styles.title}>시험 결과</h2>
      <div className={styles.scoreSection}>
        <h3>점수: {score.toFixed(0)}점</h3>
        <p>총 {answers.length}문제 중 {Math.round(score * answers.length / 100)}문제 정답</p>
      </div>

      <button 
        className={styles.detailButton}
        onClick={() => setShowDetails(!showDetails)}
      >
        {showDetails ? '상세 결과 숨기기' : '상세 결과 보기'}
      </button>

      {showDetails && (
        <div className={styles.details}>
          {examDetails.map((detail, index) => (
            <div key={index} className={`${styles.answerItem} ${detail.isCorrect ? styles.correct : styles.incorrect}`}>
              <h4>문제 {index + 1}</h4>
              <p className={styles.question}>{detail.question}</p>
              <p>선택한 답: {detail.userAnswer}</p>
              <p>정답: {detail.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};