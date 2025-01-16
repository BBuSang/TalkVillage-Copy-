// WrongAnswerNote.tsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Flex
} from '@chakra-ui/react';
import { QuestionType } from '../Types';
import styles from './WrongAnswerNote.module.css';

export interface WrongAnswer {
  questionType: QuestionType;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  themeId: string;
  timestamp: Date;
}

interface WrongAnswerNoteProps {
  isOpen: boolean;
  onClose: () => void;
  wrongAnswers: WrongAnswer[];
  correctAnswers: number;
  totalQuestions: number;
  onStartReview?: () => void;
  isReviewMode?: boolean;
}

const WrongAnswerNote: React.FC<WrongAnswerNoteProps> = ({
  isOpen,
  onClose,
  wrongAnswers,
  correctAnswers,
  totalQuestions,
  onStartReview,
  isReviewMode = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalHeader>
          {isReviewMode ? "복습 완료" : "학습 완료"}
        </ModalHeader>
        <ModalBody>
          <Text mb={4}>
            {isReviewMode
              ? "복습이 완료되었습니다!"
              : "축하합니다! 학습이 완료되었습니다!"}
          </Text>
          <Text fontWeight="bold" fontSize="lg">
            총 {totalQuestions}문제 중 {correctAnswers}문제를 맞추셨습니다!
          </Text>
          <Text
            mt={2}
            color={correctAnswers >= totalQuestions * 0.7 ? "green.500" : "orange.500"}
          >
            정답률: {(correctAnswers / totalQuestions * 100).toFixed(0)}%
          </Text>

          {wrongAnswers.length > 0 && (
            <Box mt={4}>
              <Text fontWeight="bold" mb={3}>오답 노트:</Text>
              <Box maxHeight="300px" overflowY="auto">
                {wrongAnswers.map((wrong, index) => (
                  <Box
                    key={index}
                    mt={2}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="gray.50"
                  >
                    {wrong.questionType === "dragAndDrop" ? (
                      <>
                        <Text fontWeight="medium">문제: {wrong.question}</Text>
                        <Text color="red.500">
                          {wrong.userAnswer === "답변 없음" ?
                            "미응답" :
                            `내가 만든 문장: ${wrong.userAnswer}`
                          }
                        </Text>
                        <Text color="green.500">정답: {wrong.correctAnswer}</Text>
                      </>
                    ) : (
                      <>
                        <Text fontWeight="medium">문제: {wrong.question}</Text>
                        <Text color="red.500">
                          {wrong.userAnswer === "답변 없음" ?
                            "미응답" :
                            `내 답안: ${wrong.userAnswer}`
                          }
                        </Text>
                        <Text color="green.500">정답: {wrong.correctAnswer}</Text>
                      </>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          {wrongAnswers.length > 0 && !isReviewMode && onStartReview && (
            <Button
              colorScheme="orange"
              mr={3}
              onClick={onStartReview}
            >
              오답 복습하기
            </Button>
          )}
          <Button colorScheme="blue" onClick={onClose}>
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WrongAnswerNote;