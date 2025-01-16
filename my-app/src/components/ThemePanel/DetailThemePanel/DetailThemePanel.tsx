// DetailThemePanel.tsx (Part 1)
import React, { useState, useEffect } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DropContainer from "../DragAndDropService/DropContainer";
import styles from "./DetailThemePanel.module.css";
import CreateCanvasMap from "../ImageCanvas/ImageCanvas"
import ScrollImage from "../../../image/ScrollMap.png"
import TextToSpeechPanel from "../TextToSpeechPanel/TextToSpeechPanel";

interface Word {
  id: string;
  content: string;
}

type QuestionType = "dragAndDrop" | "typeB" | "typeC";

interface Question {
  questionListId: number;
  question: string;
}

interface DetailThemePanelProps {
  sentence: string;
  onSentenceGenerated: (sentence: string) => void;
  themeId: string;
  onQuestionTypeChange: (newType: QuestionType) => void;
  questions: Question[];
  currentQuestionIndex: number;
  onNextSentence: () => void;
  questionType: QuestionType;
  currentComponent: JSX.Element | null;
  onDragAnswer?: (sentence: string, isCorrect: boolean) => void;
}

interface AnimationStyles {
  toX: number;
  toY: number;
  initialX: number;
  initialY: number;
}

const ANIMATION_DURATION = 500;
let isAnimating = false;

const DetailThemePanel: React.FC<DetailThemePanelProps> = ({
  sentence,
  onSentenceGenerated,
  themeId,
  onQuestionTypeChange,
  questions,
  currentQuestionIndex,
  onNextSentence,
  questionType,
  currentComponent,
  onDragAnswer,
}) => {
  const [initialWords, setInitialWords] = useState<Word[]>([]);
  const [availableWords, setAvailableWords] = useState<Word[]>([]);
  const [sentenceWords, setSentenceWords] = useState<Word[]>([]);
  const [movingWord, setMovingWord] = useState<string | null>(null);
  const [animationStyles, setAnimationStyles] = useState<AnimationStyles | null>(null);

  const isLastQuestion = currentQuestionIndex === 9;

  const shuffleArray = (array: Word[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const words = sentence.split(" ").filter(Boolean).map((word, index) => ({
      id: `word-${index}`,
      content: word,
    }));

    setInitialWords(words);
    setAvailableWords(shuffleArray(words));
    setSentenceWords(new Array(words.length).fill({ id: "", content: "" }));
  }, [sentence]);

  useEffect(() => {
    if (questionType === "dragAndDrop" && onDragAnswer) {
      const userSentence = sentenceWords.map(word => word.content).join(" ");
      const isCorrect = userSentence === sentence;
      if (userSentence.trim() !== '') {  // 빈 문장이 아닐 때만 체크
        onDragAnswer(userSentence, isCorrect);
      }
    }
  }, [sentenceWords, sentence, questionType, onDragAnswer]);

  const handleDrop = (
    item: { id: string; index: number; source: "available" | "sentence" },
    target: "available" | "sentence",
    dropIndex: number | null
  ) => {
    if (dropIndex === null) return;

    if (target === "sentence") {
      if (item.source === "sentence") {
        setSentenceWords(prev => {
          const updatedWords = [...prev];
          const draggedWord = updatedWords[item.index];
          const targetWord = updatedWords[dropIndex];
          updatedWords[item.index] = targetWord;
          updatedWords[dropIndex] = draggedWord;
          return updatedWords;
        });
        return;
      }

      const wordToAdd = availableWords.find((word) => word.id === item.id);
      const existingWord = sentenceWords[dropIndex];

      if (!wordToAdd) return;

      setAvailableWords((prevWords) => {
        const updatedWords = existingWord?.id
          ? [...prevWords, existingWord]
          : [...prevWords];
        return updatedWords.filter((word) => word.id !== wordToAdd.id);
      });

      setSentenceWords((prevWords) => {
        const updatedWords = [...prevWords];
        updatedWords[dropIndex] = wordToAdd;
        return updatedWords;
      });
    } else if (target === "available") {
      if (item.source === "available") {
        return;
      }

      const wordToRemove = sentenceWords[item.index];

      if (!wordToRemove || !wordToRemove.id) return;

      setSentenceWords((prevWords) => {
        const updatedWords = [...prevWords];
        updatedWords[item.index] = { id: "", content: "" };
        return updatedWords;
      });

      setAvailableWords((prevWords) => {
        const updatedWords = [...prevWords, wordToRemove];
        return shuffleArray(updatedWords);
      });
    }
  };
  // DetailThemePanel.tsx (Part 2)
  const handleWordClick = (
    wordId: string,
    source: "available" | "sentence",
    clickedElement: HTMLElement
  ) => {
    if (!wordId) return;

    if (isAnimating) {
      console.log("Animation in progress, skipping...");
      return;
    }

    const clickedRect = clickedElement.getBoundingClientRect();
    const parentRect = clickedElement.offsetParent?.getBoundingClientRect() || { left: 0, top: 0 };

    const initialX = clickedRect.left - parentRect.left;
    const initialY = clickedRect.top - parentRect.top;

    isAnimating = true;

    const fromIndex = source === "available"
      ? availableWords.findIndex((word) => word.id === wordId)
      : sentenceWords.findIndex((word) => word.id === wordId);

    const toIndex = source === "available"
      ? sentenceWords.findIndex((word) => !word.id || word.id === "")
      : availableWords.length;

    if (fromIndex === -1 || toIndex === -1) {
      isAnimating = false;
      return;
    }

    const fromWord = source === "available" ? availableWords[fromIndex] : sentenceWords[fromIndex];

    if (source === "sentence") {
      setSentenceWords(prev =>
        prev.map((word, idx) => (idx === fromIndex ? { id: "", content: "" } : word))
      );
      setAvailableWords(prev => [...prev, fromWord]);
      isAnimating = false;
      return;
    }

    const targetContainer = document.querySelector(
      `[class*="${styles.sectionContainer}"]:first-child`
    );

    if (!targetContainer) {
      isAnimating = false;
      return;
    }

    const emptySlots = Array.from(
      targetContainer.querySelectorAll(`[class*="${styles.draggableWord}"]`)
    );

    const emptySlot = emptySlots[toIndex] as HTMLElement;
    if (!emptySlot) {
      isAnimating = false;
      return;
    }

    const targetRect = emptySlot.getBoundingClientRect();
    const toX = targetRect.left - clickedRect.left;
    const toY = targetRect.top - clickedRect.top;

    setMovingWord(wordId);
    setAnimationStyles({
      toX,
      toY,
      initialX,
      initialY
    });

    setTimeout(() => {
      setAvailableWords(prev => prev.filter(word => word.id !== wordId));
      setSentenceWords(prev => {
        const updated = [...prev];
        updated[toIndex] = fromWord;
        return updated;
      });

      setMovingWord(null);
      setAnimationStyles(null);
      isAnimating = false;
    }, ANIMATION_DURATION);
  };

  const combinedSentence = sentenceWords.map((word) => word.content).join(" ");

  const isSentenceCorrect = () => {
    const userSentence = sentenceWords.map((word) => word.content).join(" ");
    return userSentence === sentence;
  };

  const handleCheckSentence = () => {
    const isCorrect = isSentenceCorrect();
    if (isCorrect) {
      alert("정답입니다!");
    } else {
      alert("오답입니다. 다시 시도해 보세요.");
    }
    if (onDragAnswer) {
      onDragAnswer(combinedSentence, isCorrect);
    }
  };

  return (
    <Box className={styles.centerContainer}>
      <Box className={styles.canvasContainer}>
        <CreateCanvasMap imagePath={ScrollImage} />
        <Box className={styles.nextButtonContainer}>
          <Button
            className={styles.nextButton}
            onClick={onNextSentence}
            variant="unstyled"
            sx={{
              padding: "8px 15px",
              backgroundColor: "transparent",
              color: "#241B10",
              border: "2px solid transparent",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              _hover: {
                border: "2px solid #C29458",
                transform: "scale(1.05)",
                backgroundColor: "transparent !important"
              },
              _active: {
                backgroundColor: "transparent !important"
              }
            }}
          >
            {isLastQuestion ? "종료" : "다음"}
          </Button>
        </Box>
      </Box>
      <Box className={styles.container}>
        <DndProvider backend={HTML5Backend}>
          {questionType === "dragAndDrop" ? (
            <>
              <Box className={styles.sectionContainer}>
                <DropContainer
                  target="sentence"
                  words={sentenceWords}
                  onDrop={handleDrop}
                  isSortable={true}
                  message="여기에 드래그하여 문장을 완성하세요"
                  onWordClick={handleWordClick}
                  movingWord={movingWord}
                  animationStyles={animationStyles}
                />
              </Box>

              <Box className={styles.combinedSentenceBox} mt={4}>
                <Text fontWeight="bold" color="#241B10">
                  구성된 문장 : {combinedSentence}
                </Text>
                {combinedSentence.trim() !== '' && (
                  <TextToSpeechPanel
                    text={combinedSentence}
                    isAnswerSelected={true}
                    style={{ marginTop: '10px' }}
                  />
                )}
              </Box>

              <Button
                colorScheme="blue"
                onClick={handleCheckSentence}
                visibility="hidden"
                position="absolute"
                width="0"
                height="0"
                padding="0"
                margin="0"
                opacity="0"
                overflow="hidden"
                color="#241B10"
              >
                문장 확인
              </Button>

              <Box className={styles.sectionContainer}>
                <DropContainer
                  target="available"
                  words={availableWords}
                  onDrop={handleDrop}
                  isSortable={false}
                  message="단어 리스트"
                  onWordClick={handleWordClick}
                  movingWord={movingWord}
                  animationStyles={animationStyles}
                />
              </Box>
            </>
          ) : (
            currentComponent
          )}
        </DndProvider>
      </Box>
    </Box>
  );
};

export default DetailThemePanel;