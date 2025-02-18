// pages/VocabularyPage/VocabularyPage.tsx
import React, { useEffect, useState } from 'react';
import { Box, useToast } from '@chakra-ui/react';
import { useVocabulary, VocabularyWord } from '../../components/Vocabulary/Hook/useVocabulary';
import VocabularyHeader from '../../components/Vocabulary/VocabularyHeader/VocabularyHeader';
import VocabularyList from '../../components/Vocabulary/VocabularyList/VocabularyList';
import VocabularyPagination from '../../components/Vocabulary/VocabularyPagination/VocabularyPagination';
import VocabularyInputPanel from '../../components/Vocabulary/VocabularyInputPanel/VocabularyInputPanel';
import VocabularyTest from '../../components/Vocabulary/VocabularyTest/VocabularyTest';
import styles from './VocabularyPage.module.css';

const VocabularyPage: React.FC = () => {
  const toast = useToast();
  const [isTestMode, setIsTestMode] = useState(false);

  const {
    words,
    displayedWords,
    selectedWords,
    setSelectedWords,
    currentPage,
    totalPages,
    handleToggleSelect,
    handleToggleMemorized,
    handleDeleteWords,
    handleUpdateWord,
    addWord,
    filter,
    handleFilterChange,
    setCurrentPage,
    isLoading,
    error,
    filteredWords
  } = useVocabulary();

  useEffect(() => {
    if (error) {
      toast({
        title: "오류 발생",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

  const handlePrevPage = () => {
    setCurrentPage((prev: number) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev: number) => Math.min(totalPages, prev + 1));
  };

  const handleDeleteSelected = async () => {
    try {
      await handleDeleteWords(Array.from(selectedWords));
      toast({
        title: "삭제 완료",
        description: "선택한 단어들이 삭제되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "삭제 실패",
        description: "단어 삭제 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddWord = async (wordEN: string, wordKO: string) => {
    try {
      await addWord(wordEN, wordKO);
      toast({
        title: "단어 추가 성공",
        description: "새로운 단어가 추가되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "단어 추가 실패",
        description: "단어를 추가하는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateWordWithToast = async (id: number, wordEN: string, wordKO: string) => {
    try {
      await handleUpdateWord(id, wordEN, wordKO);
      toast({
        title: "단어 수정 성공",
        description: "단어가 성공적으로 수정되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "단어 수정 실패",
        description: "단어를 수정하는 중 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleStartTest = () => {
    if (selectedWords.size === 0) {
      toast({
        title: "선택된 단어 없음",
        description: "시험볼 단어를 선택해주세요.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setIsTestMode(true);
  };

  const handleToggleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const newSelectedWords = new Set(selectedWords);
      filteredWords.forEach((word: VocabularyWord) => {
        newSelectedWords.add(word.vocabularyListId);
      });
      setSelectedWords(newSelectedWords);
    } else {
      const newSelectedWords = new Set(selectedWords);
      filteredWords.forEach((word: VocabularyWord) => {
        newSelectedWords.delete(word.vocabularyListId);
      });
      setSelectedWords(newSelectedWords);
    }
  };

  const isAllSelected = filteredWords.length > 0 &&
    filteredWords.every((word: VocabularyWord) => selectedWords.has(word.vocabularyListId));

  const selectedWordsList = words.filter(word =>
    selectedWords.has(word.vocabularyListId)
  );

  return (
    <Box className={styles.container}>
      {isTestMode ? (
        <VocabularyTest
          selectedWords={selectedWordsList}
          onClose={() => setIsTestMode(false)}
        />
      ) : (
        <>
          <VocabularyInputPanel onAddWord={handleAddWord} />

          <VocabularyHeader
            onDeleteSelected={handleDeleteSelected}
            onStartTest={handleStartTest}
            selectedCount={selectedWords.size}
            totalCount={filteredWords.length}
            onToggleSelectAll={handleToggleSelectAll}
            isAllSelected={isAllSelected}
          />

          {isLoading ? (
            <Box textAlign="center" py={10}>로딩 중...</Box>
          ) : (
            <>
              <VocabularyList
                words={displayedWords}
                selectedWords={selectedWords}
                currentPage={currentPage}
                onToggleSelect={handleToggleSelect}
                onToggleMemorized={handleToggleMemorized}
                onFilterChange={handleFilterChange}
                currentFilter={filter}
                onUpdateWord={handleUpdateWordWithToast}
              />

              <VocabularyPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevPage={handlePrevPage}
                onNextPage={handleNextPage}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default VocabularyPage;