import React from 'react';
import { 
  Flex, 
  Button, 
  Text,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import styles from './VocabularyPagination.module.css';

interface VocabularyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const VocabularyPagination: React.FC<VocabularyPaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <Flex 
      justify="center" 
      align="center" 
      mt={3}  // mt={6}에서 축소
      className={styles.paginationContainer}
    >
      <Tooltip label="이전 페이지" placement="top">
        <IconButton
          aria-label="Previous page"
          icon={<ChevronLeftIcon boxSize={4} />}  // boxSize={6}에서 축소
          onClick={onPrevPage}
          isDisabled={currentPage === 1}
          variant="ghost"
          colorScheme="blue"
          size="sm"  // size="lg"에서 "sm"으로 변경
          mx={1}  // mx={2}에서 축소
          _hover={{ 
            bg: '#e0eefa',
            transform: 'translateX(-2px)'
          }}
          _active={{
            bg: '#cae0f5',
            transform: 'translateX(0)'
          }}
          transition="all 0.2s"
        />
      </Tooltip>

      <Flex 
        align="center" 
        justify="center" 
        minW="80px"  // minW="100px"에서 축소
        bg="white"
        px={2}  // px={4}에서 축소
        py={1}  // py={2}에서 축소
        borderRadius="md"
        boxShadow="sm"
        borderWidth="1px"
        borderColor="rgba(0, 0, 0, 0.05)"
      >
        <Text 
          fontSize="sm"  // fontSize="md"에서 "sm"으로 변경
          fontWeight="medium"
          color="#2c5282"
        >
          {currentPage} / {totalPages}
        </Text>
      </Flex>

      <Tooltip label="다음 페이지" placement="top">
        <IconButton
          aria-label="Next page"
          icon={<ChevronRightIcon boxSize={4} />}  // boxSize={6}에서 축소
          onClick={onNextPage}
          isDisabled={currentPage === totalPages}
          variant="ghost"
          colorScheme="blue"
          size="sm"  // size="lg"에서 "sm"으로 변경
          mx={1}  // mx={2}에서 축소
          _hover={{ 
            bg: '#e0eefa',
            transform: 'translateX(2px)'
          }}
          _active={{
            bg: '#cae0f5',
            transform: 'translateX(0)'
          }}
          transition="all 0.2s"
        />
      </Tooltip>
    </Flex>
  );
};

export default VocabularyPagination;
