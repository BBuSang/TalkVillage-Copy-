// VocabularyItem.tsx
import React from 'react';
import { Checkbox, Flex, Text, Button } from '@chakra-ui/react';
import styles from './VocabularyItem.module.css';

interface VocabularyItemProps {
  index: number;
  wordEN: string;
  wordKO: string;
  isMemorized: boolean;
  onToggleMemorized: () => void;
  isSelected: boolean;
  onToggleSelect: () => void;
}

const VocabularyItem: React.FC<VocabularyItemProps> = ({
  index,
  wordEN,
  wordKO,
  isMemorized,
  onToggleMemorized,
  isSelected,
  onToggleSelect,
}) => {
  return (
    <Flex className={styles.wrapper}>
      <Flex className={styles.itemContainer}>
        <Checkbox
          isChecked={isSelected}
          onChange={onToggleSelect}
          className={styles.checkbox}
        />
        <Text className={styles.index}>{index}</Text>
        <Text className={styles.wordKO}>{wordKO}</Text>
        <Text className={styles.wordEN}>{wordEN}</Text>
      </Flex>
      <Button
        onClick={onToggleMemorized}
        colorScheme={isMemorized ? "green" : "gray"}
        className={styles.memorizeButton}
      >
        {isMemorized ? "암기완료" : "미암기"}
      </Button>
    </Flex>
  );
};

export default VocabularyItem;