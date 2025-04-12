import React, { useState, useEffect } from 'react';
import { Exam } from '../types/exam';
import { examService } from '../examService';
import styles from './ExamSentencePanel.module.css';

interface ExamSentencePanelProps {
  currentStep: number;
  onAnswer: (answer: string) => void;
  examType: 'sentence' | 'word';
}

export const ExamSentencePanel: React.FC<ExamSentencePanelProps> = ({ 
  currentStep, 
  onAnswer,
  examType 
}) => {
  const [exam, setExam] = useState<Exam | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [startId, setStartId] = useState<number | null>(null);

  useEffect(() => {
    const initializeStartId = async () => {
      try {
        const ids = await examService.getStartIds();
        setStartId(examType === 'sentence' ? ids.sentenceStartId : ids.wordStartId);
      } catch (error) {
        console.error('Failed to get start IDs:', error);
        setError('시작 ID를 가져오는데 실패했습니다.');
      }
    };

    initializeStartId();
  }, [examType]);

  useEffect(() => {
    const fetchExam = async () => {
      if (startId === null) return;
      
      setIsLoading(true);
      setError('');
      try {
        const data = examType === 'sentence' 
          ? await examService.getExamQuestion(startId + currentStep)
          : await examService.getWordTestQuestion(startId + currentStep);
        
        if (!data) {
          throw new Error('시험 문제를 찾을 수 없습니다.');
        }
        
        console.log('Loaded exam data:', data);
        setExam(data);
        setSelectedAnswer('');
      } catch (error) {
        console.error('Failed to load exam:', error);
        setError('시험 문제를 불러오는데 실패했습니다. 다시 시도해주세요.');
        setExam(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExam();
  }, [currentStep, examType, startId]);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      console.log('Submitting answer:', selectedAnswer);
      onAnswer(selectedAnswer);
    }
  };

  if (startId === null) {
    return <div className={styles.loading}>시작 ID를 불러오는 중...</div>;
  }

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <p>문제를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className={styles.error}>
        <p>시험 문제를 찾을 수 없습니다.</p>
        <button onClick={() => window.location.reload()}>새로고침</button>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h2>문제 {currentStep + 1}</h2>
        <p className={styles.examType}>
          {examType === 'sentence' ? '문장 시험' : '단어 시험'}
        </p>
      </div>

      {exam.passage && (
        <div className={styles.passage}>
          <h3>지문</h3>
          <div className={styles.passageContent}>{exam.passage}</div>
        </div>
      )}

      <div className={styles.question}>
        <h3>문제</h3>
        <p>{exam.examQuestion}</p>
      </div>

      <div className={styles.options}>
        {[exam.option1, exam.option2, exam.option3, exam.option4].map((option, index) => (
          <label 
            key={index} 
            className={`${styles.optionLabel} ${
              selectedAnswer === `option${index + 1}` ? styles.selected : ''
            }`}
          >
            <input
              type="radio"
              name="answer"
              value={`option${index + 1}`}
              checked={selectedAnswer === `option${index + 1}`}
              onChange={(e) => handleAnswerSelection(e.target.value)}
              disabled={isLoading}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className={styles.buttonContainer}>
        <button 
          className={`${styles.submitButton} ${!selectedAnswer ? styles.disabled : ''}`}
          onClick={handleSubmit}
          disabled={!selectedAnswer || isLoading}
        >
          다음
        </button>
      </div>
    </div>
  );
};