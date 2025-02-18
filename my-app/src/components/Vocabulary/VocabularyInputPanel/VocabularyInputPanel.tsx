// components/Vocabulary/VocabularyInputPanel/VocabularyInputPanel.tsx
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import styles from './VocabularyInputPanel.module.css';

interface VocabularyInputPanelProps {
  onAddWord: (wordEN: string, wordKO: string) => Promise<void>;
}

const VocabularyInputPanel: React.FC<VocabularyInputPanelProps> = ({ onAddWord }) => {
  const [wordEN, setWordEN] = useState('');
  const [wordKO, setWordKO] = useState('');
  const toast = useToast();

  const handleSubmit = async () => {
    if (!wordEN.trim() || !wordKO.trim()) {
      toast({
        title: "입력 오류",
        description: "영단어와 한글 뜻을 모두 입력해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await onAddWord(wordEN.trim(), wordKO.trim());
      setWordEN('');
      setWordKO('');
    } catch (error) {
      // 상위 컴포넌트에서 에러 처리
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <Box 
      p={6} 
      bg="white" 
      borderRadius="12px" 
      shadow="sm"
      borderWidth="1px"
      borderColor="rgba(0, 0, 0, 0.05)"
      className={styles.inputPanel}
    >
      <VStack spacing={2}>
        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          color="#2c5282"
          letterSpacing="tight"
        >
          새 단어 추가
        </Text>
        <HStack width="100%" spacing={2}>
  <Input
    placeholder="영단어 입력"
    value={wordEN}
    onChange={(e) => setWordEN(e.target.value)}
    onKeyPress={handleKeyPress}
    size="sm"  // size="md"에서 "sm"으로 변경
    height="32px"  // 높이 직접 지정
    fontSize="sm"  // 폰트 크기도 축소
    borderColor="#d1e4f7"
    _hover={{ borderColor: "#3182ce" }}
    _focus={{ 
      borderColor: "#3182ce", 
      boxShadow: "0 0 0 1px #3182ce" 
    }}
    bg="white"
    py={1}  // 상하 패딩 축소
  />
  <Input
    placeholder="한글 뜻 입력"
    value={wordKO}
    onChange={(e) => setWordKO(e.target.value)}
    onKeyPress={handleKeyPress}
    size="sm"  // size="md"에서 "sm"으로 변경
    height="32px"  // 높이 직접 지정
    fontSize="sm"  // 폰트 크기도 축소
    borderColor="#d1e4f7"
    _hover={{ borderColor: "#3182ce" }}
    _focus={{ 
      borderColor: "#3182ce", 
      boxShadow: "0 0 0 1px #3182ce" 
    }}
    bg="white"
    py={1}  // 상하 패딩 축소
  />
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleSubmit}
            px={8}
            bg="#3182ce"
            _hover={{ 
              bg: "#2c5282",
              transform: 'translateY(-1px)'
            }}
            _active={{
              bg: "#2a4365",
              transform: 'translateY(0)'
            }}
            transition="all 0.2s"
            boxShadow="sm"
          >
            추가
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default VocabularyInputPanel;