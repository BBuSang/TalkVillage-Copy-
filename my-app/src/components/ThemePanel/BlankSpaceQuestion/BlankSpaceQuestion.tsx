// components/ThemePanel/BlankSpaceQuestion/BlankSpaceQuestion.tsx
import React from 'react';
import { Box, Text, Button } from '@chakra-ui/react';
import styles from './BlankSpaceQuestion.module.css';

interface BlankSpaceQuestionProps {
  sentence: string;
  options: string[];
  correctAnswer: string;
  blankIndex: number;
  filledWord: string | null;
  setFilledWord: (word: string) => void;
  setAnswerMessage: (message: string) => void;
  answerMessage: string;
  onAnswer: (word: string, isCorrect: boolean) => void;  // 수정된 타입
}

const BlankSpaceQuestion: React.FC<BlankSpaceQuestionProps> = ({
  sentence,
  options,
  correctAnswer,
  blankIndex,
  filledWord,
  setFilledWord,
  setAnswerMessage,
  answerMessage,
  onAnswer,
}) => {
  const words = sentence.split(' ');

  const handleOptionClick = (word: string) => {
    setFilledWord(word);
    const isCorrect = word === correctAnswer;
    if (isCorrect) {
      setAnswerMessage('정답입니다!');
    } else {
      setAnswerMessage('오답입니다. 다시 시도해 보세요.');
    }
    onAnswer(word, isCorrect);  // 수정된 부분: 단어와 정답 여부 함께 전달
  };

  return (
    <Box className={styles.container}>
      <Text className={styles.BlankQuestionText}>빈칸에 알맞는 단어를 선택해주세요.</Text>

      <Text className={styles.sentence}>
        {words.map((word, index) =>
          index === blankIndex ? (
            <span key={index} className={styles.filled}>
              {filledWord || '___'}
            </span>
          ) : (
            ` ${word} `
          )
        )}
      </Text>

      <Box className={styles.options}>
        {options.map(option => (
          <Button
            key={option}
            onClick={() => handleOptionClick(option)}
            className={`${styles.optionButton} ${filledWord === option ? styles.selected : ''}`}
          >
            {option}
          </Button>
        ))}
      </Box>

      {answerMessage && (
        <Text
          className={`${styles.message} ${answerMessage === '정답입니다!' ? styles.messageSuccess : styles.messageError
            }`}
        >
          {answerMessage}
        </Text>
      )}
    </Box>
  );
};

export default BlankSpaceQuestion;