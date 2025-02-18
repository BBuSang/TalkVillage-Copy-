// components/Vocabulary/VocabularyHeader/VocabularyHeader.tsx
import React from 'react';
import { Checkbox } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import styles from './VocabularyHeader.module.css';
import classNames from 'classnames';

interface VocabularyHeaderProps {
  onDeleteSelected: () => void;
  onStartTest: () => void;
  selectedCount: number;
  totalCount: number;
  onToggleSelectAll: (isSelected: boolean) => void;
  isAllSelected: boolean;
}

const VocabularyHeader: React.FC<VocabularyHeaderProps> = ({
  onDeleteSelected,
  onStartTest,
  selectedCount,
  totalCount,
  onToggleSelectAll,
  isAllSelected
}) => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.flexContainer}>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            isChecked={isAllSelected}
            onChange={(e) => onToggleSelectAll(e.target.checked)}
            size="sm"
          >
            전체 선택 ({selectedCount}/{totalCount})
          </Checkbox>
        </div>
        <div className={styles.spacer} />
        {selectedCount > 0 && (
          <>
            <button
              className={classNames(styles.button, styles.testButton)}
              onClick={onStartTest}
            >
              <EditIcon />
              단어 시험 ({selectedCount})
            </button>
            <button
              className={classNames(styles.button, styles.deleteButton)}
              onClick={onDeleteSelected}
            >
              <DeleteIcon />
              선택삭제 ({selectedCount})
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VocabularyHeader;