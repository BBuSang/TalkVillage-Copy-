// ThemeStudyChapter.tsx - Part 1
import React, { useState, useEffect, useCallback } from "react";
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
import translationService from "../../components/Apis/TranslationService";
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

const ThemeStudyChapter: React.FC = () => {
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
  const toast = useToast();
  // ThemeStudyChapter.tsx - Part 2

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
      userAnswer: userAnswer || "답변 없음",  // 사용자 답변이 없는 경우 처리
      correctAnswer: correctAnswer,
      themeId: themeId,
      timestamp: new Date()
    };
  
    // 이전 동일 문제의 오답을 제거하고 새로운 오답 추가
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
      // 정답인 경우 이전 오답 제거
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
      // 정답인 경우 이전 오답 제거
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
  // ThemeStudyChapter.tsx - Part 3

  const handleNextSentence = () => {
    const currentQuestion = questions[currentQuestionIndex];
    
    // 현재 문제를 풀지 않고 넘어갈 경우 오답으로 처리
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
      
      // 문장이 비어있거나 원래 문제와 동일한 경우 (드래그하지 않은 경우) 미응답으로 처리
      if (!sentence || sentence === currentQuestion.question) {
        saveWrongAnswer(
          "답변 없음",
          currentQuestion.question,
          currentQuestion.question  // 드래그 유형은 전체 문장이 정답
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
      setCorrectAnswer(nextQuestion.question);  // 드래그 유형은 전체 문장이 정답
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
    
    // 새로운 테마 설정
    setThemeId(newThemeId);
    setIsThemeSelected(true);
    fetchQuestions(newThemeId);
  };

  const startReview = useCallback(() => {
    console.log("복습 시작", wrongAnswers);
    
    // wrongAnswers의 순서 그대로 문제들을 매칭
    const wrongQuestions = wrongAnswers.map(wrongAnswer => {
      return questions.find(q => q.question === wrongAnswer.question);
    }).filter((q): q is Question => q !== undefined);
  
    console.log("틀린 문제들:", wrongQuestions);
  
    if (wrongQuestions.length > 0) {
      // 먼저 모든 상태를 초기화
      setCurrentQuestionIndex(0);
      setCurrentStep(0);
      setCorrectAnswers(0);
      setWrongAnswers([]);
      setFilledWord(null);
      setSelectedWord(null);
      setSentence(wrongQuestions[0].question);  // 첫 번째 문제의 문장으로 초기화
      
      // 첫 번째 문제의 타입에 따라 questionType 설정
      let initialQuestionType: QuestionType;
      if (wrongQuestions[0].type === "word") {
        initialQuestionType = "typeC";
      } else if (wrongQuestions[0].type === "blank") {
        initialQuestionType = "typeB";
      } else {
        initialQuestionType = "dragAndDrop";
      }
      setQuestionType(initialQuestionType);
      
      // 마지막으로 questions 배열 업데이트
      setQuestions(wrongQuestions);
      setIsReviewMode(true);
      setIsQuizComplete(false);
    }
  }, [wrongAnswers, questions]);
  // ThemeStudyChapter.tsx - Part 4

  const fetchQuestions = useCallback(async (themeId: string) => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentStep(0);
    setSentence("");
    setCurrentOptions([]);
    setBlankIndex(-1);

    if (!themeId) {
      console.error("themeId가 설정되지 않았습니다.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:9999/api/questionsByTheme?themeId=${themeId}`,
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

        const firstQuestion = finalQuestions[0];
        if (firstQuestion?.type === "sentence") {
          setSentence(firstQuestion.question);
          setCorrectAnswer(firstQuestion.result);
          setCurrentOptions(generateOptions(firstQuestion.result));
        } else if (firstQuestion?.type === "blank") {
          const blankSentence = createBlankSentence(firstQuestion.question, firstQuestion.result);
          setSentence(blankSentence);
          setCorrectAnswer(firstQuestion.result);
          setCurrentOptions([
            firstQuestion.result,
            ...(firstQuestion.wrongData?.split(',') || [])
          ].sort(() => Math.random() - 0.5));
          setBlankIndex(findBlankIndex(blankSentence));
        }

        await preloadTypeCImage(
          finalQuestions.filter((q) => q.type === "word"),
          themeId
        );
      } else {
        console.error("Failed to fetch data from server.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [findBlankIndex]);

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
  // ThemeStudyChapter.tsx - Part 5

  useEffect(() => {
    if (themeId) {
      fetchQuestions(themeId);
    }
  }, [themeId, fetchQuestions]);

  useEffect(() => {
    const preloadTranslations = async () => {
      if (questions.length > 0) {
        const wordTypeAnswers = questions
          .filter(q => q.type === "word")
          .map(q => q.result);

        await translationService.preloadTranslations(wordTypeAnswers);
      }
    };

    preloadTranslations();
  }, [questions]);

  useEffect(() => {
    const translateCurrentWord = async () => {
      if (questionType === "typeC" && questions[currentQuestionIndex]?.result) {
        try {
          const translated = await translationService.translateWord(
            questions[currentQuestionIndex].result
          );
          setTranslatedWord(translated);
        } catch (error) {
          console.error("Translation error:", error);
        }
      }
    };

    translateCurrentWord();
  }, [currentQuestionIndex, questionType, questions]);

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
              <StagePanel 
                currentStep={currentQuestionIndex}
              />
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
                        onAnswer={(word, isCorrect) => {
                          if (!isCorrect) {
                            saveWrongAnswer(
                              word,
                              questions[currentQuestionIndex].question,
                              questions[currentQuestionIndex].result
                            );
                          } else {
                            setCorrectAnswers(prev => prev + 1);
                            setWrongAnswers(prev =>
                              prev.filter(w => w.question !== questions[currentQuestionIndex].question)
                            );
                          }
                        }}
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
                        "{translatedWord}" 에 해당하는 이미지를 선택하세요
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
                                <Text
                                  mt={4}
                                  textAlign="center"
                                  fontSize="24px"
                                  color="#241B10"
                                  fontWeight="bold"
                                >
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
                
                // 이전 오답이 있다면 제거
                setWrongAnswers(prev => 
                  prev.filter(w => w.question !== currentQuestion.question)
                );
                
                if (!isCorrect) {
                  // 사용자가 구성한 문장을 오답으로 저장
                  saveWrongAnswer(
                    userSentence,  // 사용자가 드래그로 만든 문장
                    currentQuestion.question,  // 원래 문제
                    currentQuestion.question   // 드래그 유형은 전체 문장이 정답
                  );
                } else {
                  setCorrectAnswers(prev => prev + 1);
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
          setIsThemeSelected(false);  // 테마 선택 화면으로 돌아가기 위해 추가
          if (isReviewMode) {
            setIsReviewMode(false);
          }
          // 모든 상태 초기화
          setQuestions([]);
          setCurrentQuestionIndex(0);
          setCurrentStep(0);
          setCorrectAnswers(0);
          setWrongAnswers([]);
          setFilledWord(null);
          setSelectedWord(null);
          setSentence("");
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