import React from 'react';
import { Box, Text, Image } from '@chakra-ui/react';
import SearchThemePanel from '../SearchThemePanel/SearchThemePanel';
import styles from './InitialThemeSelectionPanel.module.css';
import themeIcon from '../../../image/adminimage.png';

interface InitialThemeSelectionPanelProps {
  onThemeSelect: (themeId: string) => void;
}

const InitialThemeSelectionPanel: React.FC<InitialThemeSelectionPanelProps> = ({ onThemeSelect }) => {
  return (
    <div className={styles.container}>
      <Box className={styles.panel}>
        <div className={styles.avatar}>
          <Image src={themeIcon} alt="Theme Icon" borderRadius="full" maxHeight="100%" maxWidth="100%" />
        </div>
        <Text className={styles.heading}>
          테마를 선택해주세요
        </Text>
        <SearchThemePanel onThemeSelect={onThemeSelect} />
      </Box>
    </div>
  );
};

export default InitialThemeSelectionPanel;
