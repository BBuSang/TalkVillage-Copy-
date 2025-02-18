import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import styles from "./ThemeStudyChapter.module.css";
import InitialThemeSelectionPanel from "../../components/ThemePanel/InitialThemeSelectionPanel/InitialThemeSelectionPanel";
import DetailThemePanel from "../../components/ThemePanel/DetailThemePanel/DetailThemePanel";
import BlankSpaceQuestion from "../../components/ThemePanel/BlankSpaceQuestion/BlankSpaceQuestion";
import { QuestionType } from "../../components/ThemePanel/Types";
import StagePanel from "../../components/ThemePanel/StagePanel/StagePanel";
import TextToSpeechPanel from "../../components/ThemePanel/TextToSpeechPanel/TextToSpeechPanel";
import TranslationService from "../../components/Apis/TranslationService";
import WrongAnswerNote, { WrongAnswer } from "../../components/ThemePanel/WrongAnswerNote/WrongAnswerNote";

interface Question {
  questionListId: number;
  question: string;
  result: string;
  imageUrl?: string;
  type: string;
  wrongData?: string;
}

interface ImageData {
  image: string;
  word: string;
  result: string;
  questionListId: number;
}

interface LocationState {
  mode: 'theme' | 'stage';
  identifier: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

const ThemeStudyChapter: React.FC = () => {
  const location = useLocation();
  const locationState = location.state as LocationState;
  const toast = useToast();

  const [isThemeSelected, setIsThemeSelected] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [sentence, setSentence] = useState<string>("");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [filledWord, setFilledWord] = useState<string | null>(null);
  const [blankIndex, setBlankIndex] = useState<number>(-1);
  const [answerMessage, setAnswerMessage] = useState<string>("");
  const [questionType, setQuestionType] = useState<QuestionType>("dragAndDrop");
  const [currentOptions, setCurrentOptions] = useState<string[]>([]);
  const [themeId, setThemeId] = useState<string>("");
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [preloadedTypeCImages, setPreloadedTypeCImages] = useState<ImageData[]>([]);
  const [currentImageSetIndex, setCurrentImageSetIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [translatedWord, setTranslatedWord] = useState<string>("");
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    if (locationState?.mode === 'stage') {
      setThemeId(locationState.identifier);
      setIsThemeSelected(true);
      fetchQuestions(locationState.identifier);
    }
  }, [locationState]);
  const handleInitialQuestion = (question: Question) => {
    let initialQuestionType: QuestionType;

    if (question.type === "word") {
      initialQuestionType = "typeC";
      setSentence(question.question);
      setCorrectAnswer(question.result);
    } else if (question.type === "blank") {
      initialQuestionType = "typeB";
      const blankSentence = createBlankSentence(question.question, question.result);
      setSentence(blankSentence);
      setCorrectAnswer(question.result);
      setCurrentOptions([
        question.result,
        ...(question.wrongData?.split(',') || [])
      ].sort(() => Math.random() - 0.5));
      setBlankIndex(findBlankIndex(blankSentence));
    } else {
      initialQuestionType = "dragAndDrop";
      setSentence(question.question);
      setCorrectAnswer(question.question);
    }

    setQuestionType(initialQuestionType);
  };

  const generateOptions = (correctAnswer: string) => {
    const options = ["apple", "banana", correctAnswer];
    return options.sort(() => Math.random() - 0.5);
  };

  const createBlankSentence = (sentence: string, answer: string) => {
    return sentence.replace(answer, '___');
  };

  const findBlankIndex = useCallback((sentence: string) => {
    const words = sentence.split(" ");
    return words.findIndex(word => word.includes('___'));
  }, []);

  const saveWrongAnswer = (userAnswer: string, question: string, correctAnswer: string) => {
    const wrongAnswer: WrongAnswer = {
      questionType: questionType,
      question: question,
      userAnswer: userAnswer || "답변 없음",
      correctAnswer: correctAnswer,
      themeId: themeId,
      timestamp: new Date()
    };

    setWrongAnswers(prev => [
      ...prev.filter(w => w.question !== question),
      wrongAnswer
    ]);
  };

  const handleImageClick = (clickedWord: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    console.log("클릭된 단어:", clickedWord);
    console.log("현재 문제:", currentQuestion);
    console.log("현재 문제의 정답:", currentQuestion.result);

    if (!currentQuestion || !currentQuestion.result) {
      console.error("Current question or result is undefined.");
      return;
    }

    const normalize = (str: string) =>
      str.trim().toLowerCase().replace(/[^\w\s]/g, "");

    const isCorrect = normalize(clickedWord) === normalize(currentQuestion.result);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setWrongAnswers(prev =>
        prev.filter(w => w.question !== currentQuestion.question)
      );
    } else {
      saveWrongAnswer(
        clickedWord,
        currentQuestion.question,
        currentQuestion.result
      );
    }

    setSelectedWord(clickedWord);
  };

  const handleBlankAnswer = (word: string, isCorrect: boolean) => {
    const currentQuestion = questions[currentQuestionIndex];

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setWrongAnswers(prev =>
        prev.filter(w => w.question !== currentQuestion.question)
      );
    } else {
      saveWrongAnswer(
        word,
        currentQuestion.question,
        currentQuestion.result
      );
    }
  };

  const handleNextSentence = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (questionType === "typeB" && !filledWord) {
      saveWrongAnswer(
        "답변 없음",
        currentQuestion.question,
        currentQuestion.result
      );
    } else if (questionType === "typeC" && !selectedWord) {
      saveWrongAnswer(
        "답변 없음",
        currentQuestion.question,
        currentQuestion.result
      );
    } else if (questionType === "dragAndDrop") {
      const normalize = (str: string) =>
        str.trim().toLowerCase().replace(/[^\w\s]/g, "");

      if (!sentence || sentence === currentQuestion.question) {
        saveWrongAnswer(
          "답변 없음",
          currentQuestion.question,
          currentQuestion.question
        );
      }
    }
    if (currentQuestionIndex >= questions.length - 1) {
      setIsQuizComplete(true);
      if (isReviewMode) {
        fetchQuestions(themeId);
        setIsReviewMode(false);
      }
      return;
    }

    const newIndex = currentQuestionIndex + 1;
    const nextQuestion = questions[newIndex];

    setFilledWord(null);
    setSelectedWord(null);
    setCurrentQuestionIndex(newIndex);
    setAnswerMessage("");

    let nextQuestionType: QuestionType;
    if (nextQuestion?.type === "word") {
      nextQuestionType = "typeC";
      setSentence(nextQuestion.question);
      const typeCIndex = Math.floor(newIndex / 3);
      setCurrentImageSetIndex(typeCIndex);
      setCorrectAnswer(nextQuestion.result);
    } else if (nextQuestion?.type === "blank") {
      nextQuestionType = "typeB";
      const blankSentence = createBlankSentence(nextQuestion.question, nextQuestion.result);
      setSentence(blankSentence);
      setCorrectAnswer(nextQuestion.result);
      setCurrentOptions([
        nextQuestion.result,
        ...(nextQuestion.wrongData?.split(',') || [])
      ].sort(() => Math.random() - 0.5));
      setBlankIndex(findBlankIndex(blankSentence));
    } else {
      nextQuestionType = "dragAndDrop";
      setSentence(nextQuestion.question);
      setCorrectAnswer(nextQuestion.question);
    }

    setQuestionType(nextQuestionType);
  };

  const handleThemeSelect = (newThemeId: string) => {
    // 모든 상태 초기화
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setCorrectAnswers(0);
    setWrongAnswers([]);
    setFilledWord(null);
    setSelectedWord(null);
    setSentence("");
    setAnswerMessage("");
    setQuestionType("dragAndDrop");
    setCurrentOptions([]);
    setBlankIndex(-1);
    setCurrentImageSetIndex(0);
    setTranslatedWord("");
    setIsQuizComplete(false);
    setIsReviewMode(false);

    // 새로운 테마 설정 및 문제 가져오기
    setThemeId(newThemeId);
    setIsThemeSelected(true);
    fetchQuestions(newThemeId);
  };

  const fetchQuestions = useCallback(async (id: string) => {
    try {
      const endpoint = locationState?.mode === 'stage'
        ? '/api/LevelQuestions'
        : '/api/questionsByTheme';

      // 난이도 파라미터 추가
      const params = new URLSearchParams();
      if (locationState?.mode === 'stage') {
        params.append('stageId', id);
        if (locationState?.level) {
          params.append('level', locationState.level);
        }
      } else {
        params.append('themeId', id);
      }

      const response = await fetch(
        `http://localhost:9999${endpoint}?${params.toString()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data: Question[] = await response.json();
        let finalQuestions: Question[] = [];
        const wordQuestions = data.filter(q => q.type === "word");
        const blankQuestions = data.filter(q => q.type === "blank");
        const sentenceQuestions = data.filter(q => q.type === "sentence");

        for (let i = 0; i < 9; i++) {
          if (i % 3 === 2) {
            if (wordQuestions.length > Math.floor(i / 3)) {
              finalQuestions.push(wordQuestions[Math.floor(i / 3)]);
            }
          } else if (i % 3 === 1) {
            if (blankQuestions.length > Math.floor(i / 3)) {
              finalQuestions.push(blankQuestions[Math.floor(i / 3)]);
            }
          } else {
            if (sentenceQuestions.length > Math.floor(i / 3)) {
              finalQuestions.push(sentenceQuestions[Math.floor(i / 3)]);
            }
          }
        }

        if (blankQuestions.length > 3) {
          finalQuestions.push(blankQuestions[3]);
        }

        console.log("Final questions array:", finalQuestions);
        setQuestions(finalQuestions);

        if (finalQuestions.length > 0) {
          handleInitialQuestion(finalQuestions[0]);
        }

        await preloadTypeCImage(
          finalQuestions.filter((q) => q.type === "word"),
          id
        );
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "오류 발생",
        description: "문제를 불러오는데 실패했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [locationState?.mode, locationState?.level, toast, handleInitialQuestion]);

  const preloadTypeCImage = async (wordQuestions: Question[], themeId: string) => {
    try {
      let allImages: ImageData[] = [];

      for (const question of wordQuestions) {
        const words = question.question.split(',').map(word => word.trim());
        let imageSet: ImageData[] = [];

        for (const word of words) {
          const imageUrl = `/api/image-display/images/${word.toLowerCase()}.png`;

          imageSet.push({
            image: `http://localhost:9999${imageUrl}`,
            word: word,
            result: question.result,
            questionListId: question.questionListId
          });
        }

        if (imageSet.length > 0) {
          allImages = [...allImages, ...imageSet];
        }
      }

      console.log("최종 이미지 배열:", allImages);
      setPreloadedTypeCImages(allImages);
    } catch (error) {
      console.error("이미지 로드 중 에러 발생:", error);
    }
  };

  const startReview = useCallback(() => {
    console.log("복습 시작", wrongAnswers);

    const wrongQuestions = wrongAnswers.map(wrongAnswer => {
      return questions.find(q => q.question === wrongAnswer.question);
    }).filter((q): q is Question => q !== undefined);

    console.log("틀린 문제들:", wrongQuestions);

    if (wrongQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      setCurrentStep(0);
      setCorrectAnswers(0);
      setWrongAnswers([]);
      setFilledWord(null);
      setSelectedWord(null);
      setSentence(wrongQuestions[0].question);

      let initialQuestionType: QuestionType;
      if (wrongQuestions[0].type === "word") {
        initialQuestionType = "typeC";
      } else if (wrongQuestions[0].type === "blank") {
        initialQuestionType = "typeB";
      } else {
        initialQuestionType = "dragAndDrop";
      }
      setQuestionType(initialQuestionType);

      setQuestions(wrongQuestions);
      setIsReviewMode(true);
      setIsQuizComplete(false);
    }
  }, [wrongAnswers, questions]);

  useEffect(() => {
    const translateCurrentWord = async () => {
      if (questionType === "typeC" && questions[currentQuestionIndex]?.result) {
        try {
          const response = await fetch('http://localhost:9999/api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              text: questions[currentQuestionIndex].result.trim(),
              target_lang: 'KO'
            })
          });

          if (!response.ok) {
            console.error('Translation failed:', response.status);
            return;
          }

          const responseText = await response.text();
          try {
            const result = JSON.parse(responseText);
            // 따옴표 제거 후 설정
            const cleanTranslation = result.translatedText.replace(/['"]+/g, '');
            setTranslatedWord(cleanTranslation);
          } catch (parseError) {
            console.error('Failed to parse response:', responseText);
          }
        } catch (error) {
          console.error('Translation request failed:', error);
        }
      }
    };

    translateCurrentWord();
  }, [currentQuestionIndex, questionType, questions]);


  const getReturnPath = (level?: string) => {
    if (!level) return '/mainmap';

    switch (level) {
      case 'beginner':
        return '/mainmap/beginnerStudymap';
      case 'intermediate':
        return '/mainmap/intermediateStudymap';
      case 'advanced':
        return '/mainmap/advancedStudymap';
      default:
        return '/mainmap';
    }
  };

  return (
    <Box className={styles.container}>
      {!isThemeSelected ? (
        <InitialThemeSelectionPanel onThemeSelect={handleThemeSelect} />
      ) : (
        <>
          <Box className={styles.stagePanelWrapper}>
            {isReviewMode ? (
              <Flex direction="column" align="center">
                <Text className={styles.wrongNoteTitle}>
                  오답 노트
                </Text>
                <Text fontSize="18px" color="#666" mt={2}>
                  {currentQuestionIndex + 1} / {questions.length}
                </Text>
              </Flex>
            ) : (
              <StagePanel currentStep={currentQuestionIndex} />
            )}
          </Box>

          <Box className={styles.problemContainer}>
            <DetailThemePanel
              sentence={sentence}
              onSentenceGenerated={setSentence}
              themeId={themeId}
              onQuestionTypeChange={setQuestionType}
              questions={questions}
              currentQuestionIndex={currentQuestionIndex}
              onNextSentence={handleNextSentence}
              questionType={questionType}
              currentComponent={
                <Box>
                  {questionType === "typeB" ? (
                    <>
                      <BlankSpaceQuestion
                        sentence={sentence}
                        options={currentOptions}
                        correctAnswer={correctAnswer}
                        blankIndex={blankIndex}
                        filledWord={filledWord}
                        setFilledWord={setFilledWord}
                        setAnswerMessage={setAnswerMessage}
                        answerMessage={answerMessage}
                        onAnswer={handleBlankAnswer}
                      />
                      <TextToSpeechPanel
                        text={sentence.replace('___', filledWord || '')}
                        isAnswerSelected={filledWord !== null}
                        style={{ marginTop: '10px' }}
                      />
                    </>
                  ) : questionType === "typeC" && preloadedTypeCImages.length > 0 ? (
                    <Box className={styles.imageContainer}>
                      <Text className={styles.QuestionText}>
                        {translatedWord ? `"${translatedWord}" 에 해당하는 이미지를 선택하세요` : '이미지를 선택하세요'}
                      </Text>
                      <Flex className={styles.images}>
                        {preloadedTypeCImages
                          .filter(img => img.questionListId === questions[currentQuestionIndex].questionListId)
                          .map((item, index) => (
                            <Box
                              key={index}
                              className={`${styles.buttonImage} ${selectedWord === item.word ? styles.selectedImage : ''}`}
                            >
                              <Button
                                variant="unstyled"
                                onClick={() => {
                                  handleImageClick(item.word || "unknown");
                                  setSelectedWord(item.word);
                                }}
                                className={styles.imageButton}
                              >
                                <img
                                  src={item.image}
                                  alt={item.word || "Generated"}
                                  className={styles.imageBox}
                                />
                                <Text mt={4} textAlign="center" fontSize="24px" color="#241B10" fontWeight="bold">
                                  {item.word}
                                </Text>
                              </Button>
                            </Box>
                          ))}
                      </Flex>
                      <Box className={styles.speakerContainer}>
                        <TextToSpeechPanel
                          text={selectedWord || ''}
                          isAnswerSelected={selectedWord !== null}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Text className={styles.QuestionText}>
                        {questions[currentQuestionIndex]?.question}
                      </Text>
                      <TextToSpeechPanel
                        text={questions[currentQuestionIndex]?.question}
                        isAnswerSelected={true}
                        style={{ marginTop: '10px' }}
                      />
                    </Box>
                  )}
                </Box>
              }
              onDragAnswer={(userSentence, isCorrect) => {
                const currentQuestion = questions[currentQuestionIndex];
                if (isCorrect) {
                  setCorrectAnswers(prev => prev + 1);
                  setWrongAnswers(prev =>
                    prev.filter(w => w.question !== currentQuestion.question)
                  );
                } else {
                  saveWrongAnswer(
                    userSentence,
                    currentQuestion.question,
                    currentQuestion.question
                  );
                }
              }}
            />
          </Box>
        </>
      )}

      <WrongAnswerNote
        isOpen={isQuizComplete}
        onClose={() => {
          setIsQuizComplete(false);
          if (locationState?.mode === 'stage') {
            // 난이도에 따른 적절한 경로로 이동
            const returnPath = getReturnPath(locationState.level);
            window.location.href = returnPath;
          } else if (!isReviewMode) {
            setIsThemeSelected(false);
          }
        }}
        wrongAnswers={wrongAnswers}
        correctAnswers={correctAnswers}
        totalQuestions={questions.length}
        onStartReview={wrongAnswers.length > 0 && !isReviewMode ? startReview : undefined}
        isReviewMode={isReviewMode}
      />
    </Box>
  );
};

export default ThemeStudyChapter;