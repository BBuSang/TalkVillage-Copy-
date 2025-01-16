import React, { useEffect } from 'react';
import styles from "./SentenceService.module.css"; // CSS 모듈 import

interface Question {
  questionListId: number;
  question: string;
}

interface SentenceServiceProps {
  onSentenceGenerated: (sentence: string) => void;
  themeId: string;
  onQuestionTypeChange: (type: 'dragAndDrop' | 'typeB' | 'typeC') => void;
  questions: Question[];
  currentQuestionIndex: number;
  onNextSentence: () => void;
}

const SentenceService: React.FC<SentenceServiceProps> = ({
  onSentenceGenerated,
  themeId,
  onQuestionTypeChange,
  questions,
  currentQuestionIndex,
  onNextSentence,
}) => {
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      onSentenceGenerated(questions[currentQuestionIndex].question);
    }
  }, [currentQuestionIndex, questions, onSentenceGenerated]);

  const handleNextSentence = () => {
    onNextSentence();
    onQuestionTypeChange(currentQuestionIndex % 2 === 0 ? 'typeB' : 'typeC');
  };

  return (
    <div className={styles.nextSentenceButtonContainer}>
      <button onClick={handleNextSentence} className={styles.nextSentenceButton}>제출</button>
    </div>
  );
};

export default SentenceService;
