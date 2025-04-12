import React, { useState, useEffect } from 'react';
import { ExamSentencePanel } from '../../components/ExamPanel/ExamSentencePanel/ExamSentencePanel';
import { ResultPanel } from '../../components/ExamPanel/ExamSentencePanel/ResultPanel';
import { ExamSelectPage } from './ExamSelectPage';
import { examService } from '../../components/ExamPanel/examService';
import styles from './ExamPage.module.css';

interface ExamPageProps {
  examType: 'sentence' | 'word';
}

export const ExamPage: React.FC<ExamPageProps> = ({ examType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadExamCount();
  }, [examType]);

  const loadExamCount = async () => {
    try {
      const counts = await examService.getCounts();
      setTotalQuestions(examType === 'sentence' ? counts.examCount : counts.wordTestCount);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to load exam count:', error);
      setError('시험 정보를 불러오는데 실패했습니다.');
      setIsLoading(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setAnswers([...answers, answer]);
    if (currentStep < totalQuestions - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {currentStep < totalQuestions ? (
        <ExamSentencePanel 
          currentStep={currentStep}
          onAnswer={handleAnswer}
          examType={examType}
        />
      ) : (
        <ResultPanel 
          answers={answers}
          examType={examType}
        />
      )}
    </div>
  );
};