// components/Vocabulary/VocabularyList/VocabularyList.tsx
import React, { useState } from 'react';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Checkbox,
  Select,
  IconButton,
  Input,
  HStack,
  useToast
} from '@chakra-ui/react';
import { StarIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { VocabularyWord } from '../Hook/useVocabulary';
import styles from './VocabularyList.module.css';
import VocabularyTTSPanel from '../VocabularyTTSPanel/VocabularyTTSPanel';

interface VocabularyListProps {
  words: VocabularyWord[];
  selectedWords: Set<number>;
  currentPage: number;
  onToggleSelect: (id: number) => void;
  onToggleMemorized: (id: number) => Promise<void>;
  onFilterChange: (filter: 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED') => void;
  currentFilter: 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED';
  onUpdateWord: (id: number, wordEN: string, wordKO: string) => Promise<void>;
}

interface EditingWord {
  id: number;
  wordEN: string;
  wordKO: string;
}

const VocabularyList: React.FC<VocabularyListProps> = ({
  words,
  selectedWords,
  currentPage,
  onToggleSelect,
  onToggleMemorized,
  onFilterChange,
  currentFilter,
  onUpdateWord
}) => {
  const [editingWord, setEditingWord] = useState<EditingWord | null>(null);
  const toast = useToast();

  const handleEdit = (word: VocabularyWord) => {
    setEditingWord({
      id: word.vocabularyListId,
      wordEN: word.wordEN,
      wordKO: word.wordKO
    });
  };

  const handleCancelEdit = () => {
    setEditingWord(null);
  };

  const handleSaveEdit = async () => {
    if (editingWord) {
      if (!editingWord.wordEN.trim() || !editingWord.wordKO.trim()) {
        toast({
          title: "입력 오류",
          description: "영단어와 한글 뜻을 모두 입력해주세요.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      await onUpdateWord(editingWord.id, editingWord.wordEN.trim(), editingWord.wordKO.trim());
      setEditingWord(null);
    }
  };

  return (
    <Box overflowX="auto" className={styles.tableContainer}>
      <Table variant="simple" size="md">
        <Thead>
          <Tr className={styles.header}>
            <Th width="60px" textAlign="center" px={2}>선택</Th>
            <Th width="60px" textAlign="center" px={2}>번호</Th>
            <Th width="30%" px={4}>한국어</Th>
            <Th width="30%" px={4}>영어</Th>
            <Th width="120px" textAlign="center" px={2}>
              <Select 
                size="sm"
                value={currentFilter}
                onChange={(e) => onFilterChange(e.target.value as 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED')}
                bg="white"
                width="120px"
                mx="auto"
                borderColor="#d1e4f7"
                _hover={{ borderColor: "#3182ce" }}
                _focus={{ 
                  borderColor: "#3182ce", 
                  boxShadow: "0 0 0 1px #3182ce" 
                }}
              >
                <option value="ALL">전체</option>
                <option value="MEMORIZED">암기완료</option>
                <option value="NOT_MEMORIZED">미암기</option>
              </Select>
            </Th>
            <Th width="80px" textAlign="center" px={2}>듣기</Th>
            <Th width="100px" textAlign="center" px={2}>수정</Th>
          </Tr>
        </Thead>
        <Tbody>
          {words.map((word, index) => (
            <Tr 
              key={word.vocabularyListId} 
              className={styles.row}
              _hover={{ bg: '#f8fafd' }}
            >
              <Td textAlign="center" px={2}>
                <Checkbox
                  isChecked={selectedWords.has(word.vocabularyListId)}
                  onChange={() => onToggleSelect(word.vocabularyListId)}
                  colorScheme="blue"
                  borderColor="#d1e4f7"
                />
              </Td>
              <Td textAlign="center" px={2}>
                {(currentPage - 1) * 10 + index + 1}
              </Td>
              <Td px={4}>
                {editingWord?.id === word.vocabularyListId ? (
                  <Input
                    value={editingWord.wordKO}
                    onChange={(e) => setEditingWord({
                      ...editingWord,
                      wordKO: e.target.value
                    })}
                    size="sm"
                    borderColor="#d1e4f7"
                    _hover={{ borderColor: "#3182ce" }}
                    _focus={{ 
                      borderColor: "#3182ce", 
                      boxShadow: "0 0 0 1px #3182ce" 
                    }}
                  />
                ) : word.wordKO}
              </Td>
              <Td px={4}>
                {editingWord?.id === word.vocabularyListId ? (
                  <Input
                    value={editingWord.wordEN}
                    onChange={(e) => setEditingWord({
                      ...editingWord,
                      wordEN: e.target.value
                    })}
                    size="sm"
                    borderColor="#d1e4f7"
                    _hover={{ borderColor: "#3182ce" }}
                    _focus={{ 
                      borderColor: "#3182ce", 
                      boxShadow: "0 0 0 1px #3182ce" 
                    }}
                  />
                ) : word.wordEN}
              </Td>
              <Td textAlign="center" px={2}>
                <StarIcon
                  className={styles.starIcon}
                  cursor="pointer"
                  color={word.bookmarkState ? "#3182ce" : "#d1e4f7"}
                  onClick={() => onToggleMemorized(word.vocabularyListId)}
                  _hover={{ transform: 'scale(1.2)' }}
                  transition="all 0.2s"
                />
              </Td>
              <Td textAlign="center" px={2}>
                <VocabularyTTSPanel
                  text={word.wordEN}
                  _hover={{ bg: '#e0eefa' }}
                />
              </Td>
              <Td textAlign="center" px={2}>
                {editingWord?.id === word.vocabularyListId ? (
                  <HStack spacing={1} justify="center">
                    <IconButton
                      aria-label="Save edit"
                      icon={<CheckIcon />}
                      size="sm"
                      colorScheme="green"
                      variant="ghost"
                      onClick={handleSaveEdit}
                      _hover={{ bg: '#e0eefa' }}
                    />
                    <IconButton
                      aria-label="Cancel edit"
                      icon={<CloseIcon />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={handleCancelEdit}
                      _hover={{ bg: '#ffe5e5' }}
                    />
                  </HStack>
                ) : (
                  <IconButton
                    aria-label="Edit word"
                    icon={<EditIcon />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    onClick={() => handleEdit(word)}
                    _hover={{ bg: '#e0eefa' }}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default VocabularyList;