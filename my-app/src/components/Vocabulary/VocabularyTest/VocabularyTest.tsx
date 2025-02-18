// components/Vocabulary/VocabularyTest/VocabularyTest.tsx
import React, { useState } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { VocabularyWord } from '../Hook/useVocabulary';
import styles from './VocabularyTest.module.css';
import classNames from 'classnames';
import VocabularyTTSPanel from '../VocabularyTTSPanel/VocabularyTTSPanel';

interface VocabularyTestProps {
  selectedWords: VocabularyWord[];
  onClose: () => void;
}

interface TestAnswer {
  answer: string;
  isCorrect?: boolean;
}

const VocabularyTest: React.FC<VocabularyTestProps> = ({ selectedWords, onClose }) => {
  const [hideMode, setHideMode] = useState<'EN' | 'KO' | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: TestAnswer }>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 10;

  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = selectedWords.slice(indexOfFirstWord, indexOfLastWord);
  const totalPages = Math.ceil(selectedWords.length / wordsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleAnswerChange = (id: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [id]: { answer: value }
    }));
  };

  const handleTestComplete = () => {
    const checkedAnswers = { ...answers };
    selectedWords.forEach(word => {
      const answer = checkedAnswers[word.vocabularyListId]?.answer || '';
      const correctAnswer = hideMode === 'EN' ? word.wordEN : word.wordKO;
      checkedAnswers[word.vocabularyListId] = {
        answer: answer,
        isCorrect: answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
      };
    });
    setAnswers(checkedAnswers);
    setIsTestComplete(true);
    setCurrentPage(1);  // 채점 후 1페이지로 이동
  };

  if (!hideMode) {
    return (
      <div className={styles.container}>
        <div className={styles.modeSelection}>
          <div className={styles.header}>
            <button 
              className={styles.backButton}
              onClick={onClose}
              aria-label="Back to vocabulary list"
            >
              <ArrowBackIcon />
            </button>
            <h1 className={styles.title}>단어 시험 모드</h1>
          </div>
          
          <div className={styles.content}>
            <div className={styles.subtitle}>
              <p>시험 방식을 선택해주세요</p>
              <p>선택된 단어: {selectedWords.length}개</p>
            </div>
            
            <div className={styles.buttonGroup}>
              <button
                className={styles.modeButton}
                onClick={() => setHideMode('EN')}
              >
                <span>영어 가리기</span>
                <small>한글을 보고 영어 단어를 맞춰보세요</small>
              </button>
              <button
                className={styles.modeButton}
                onClick={() => setHideMode('KO')}
              >
                <span>한글 가리기</span>
                <small>영어를 보고 한글 뜻을 맞춰보세요</small>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>영어</th>
            <th>한글</th>
            {isTestComplete && <th>듣기</th>}
            {isTestComplete && <th>입력한 답</th>}
          </tr>
        </thead>
        <tbody>
          {currentWords.map((word, index) => {
            const answer = answers[word.vocabularyListId];
            return (
              <tr 
                key={word.vocabularyListId}
                className={isTestComplete && !answer?.isCorrect ? styles.incorrectRow : ''}
              >
                <td>{indexOfFirstWord + index + 1}</td>
                <td>
                  {hideMode === 'EN' ? (
                    isTestComplete ? (
                      <span className={answer?.isCorrect ? styles.correct : styles.incorrect}>
                        {word.wordEN}
                      </span>
                    ) : (
                      <input
                        className={styles.input}
                        value={answer?.answer || ''}
                        onChange={(e) => handleAnswerChange(word.vocabularyListId, e.target.value)}
                        placeholder="영어 단어 입력"
                      />
                    )
                  ) : (
                    word.wordEN
                  )}
                </td>
                <td>
                  {hideMode === 'KO' ? (
                    isTestComplete ? (
                      <span className={answer?.isCorrect ? styles.correct : styles.incorrect}>
                        {word.wordKO}
                      </span>
                    ) : (
                      <input
                        className={styles.input}
                        value={answer?.answer || ''}
                        onChange={(e) => handleAnswerChange(word.vocabularyListId, e.target.value)}
                        placeholder="한글 뜻 입력"
                      />
                    )
                  ) : (
                    word.wordKO
                  )}
                </td>
                {isTestComplete && (
                  <td className={styles.ttsColumn}>
                    <VocabularyTTSPanel 
                      text={word.wordEN}
                      style={{ margin: '0 auto' }}
                    />
                  </td>
                )}
                {isTestComplete && (
                  <td>
                    <span className={answer?.isCorrect ? styles.correct : styles.incorrect}>
                      {answer?.answer || '(미입력)'}
                    </span>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedWords.length > wordsPerPage && (
        <div className={styles.pagination}>
          <button
            className={styles.pageButton}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            이전
          </button>
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          <button
            className={styles.pageButton}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            다음
          </button>
        </div>
      )}

      <div className={styles.controls}>
        {!isTestComplete ? (
          <button
            className={styles.submitButton}
            onClick={handleTestComplete}
          >
            채점하기
          </button>
        ) : (
          <div className={styles.resultContainer}>
            <div className={styles.result}>
              {selectedWords.length}개 중{' '}
              {Object.values(answers).filter(a => a.isCorrect).length}개 정답
            </div>
            <button
              className={styles.returnButton}
              onClick={onClose}
            >
              단어장으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyTest;