import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import styles from './ActionMenu.module.css';

const beginnerStudyMapMenu = [
  { label: 'Chapter 1', action: '1' },
  { label: 'Chapter 2', action: '2' },
  { label: 'Chapter 3', action: '3' },
  { label: 'Chapter 4', action: '4' },
  { label: 'Chapter 5', action: '5' }
];

interface ActionMenuProps {
  onChapterChange: (chapterLabel: string) => void;
  initialChapter?: string;
}

const ActionMenu = ({ onChapterChange, initialChapter = '1' }: ActionMenuProps) => {
  const [selectedAction, setSelectedAction] = useState<string>(initialChapter);

  useEffect(() => {
    setSelectedAction(initialChapter);
  }, [initialChapter]);

  const handleMenuItemClick = (action: string) => {
    setSelectedAction(action);
    onChapterChange(action);
  };

  return (
    <Menu>
      <MenuButton className={styles.menuButton} as={Button} rightIcon={<ChevronDownIcon />}>
        Chapter {selectedAction}
      </MenuButton>
      <MenuList className={styles.menuList}>
        {beginnerStudyMapMenu.map(item => (
          <MenuItem
            className={styles.menuItem}
            key={item.action}
            onClick={() => handleMenuItemClick(item.action)}
          >
            {item.label}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ActionMenu;
