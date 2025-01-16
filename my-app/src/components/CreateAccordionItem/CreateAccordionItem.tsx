import React , { useState }from 'react';
import { AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import styles from './CreateAccordionItem.module.css';

interface CreateAccordionItemProps {
  title: string;
  content: string[];
  isActive: boolean;
  onClick: () => void;
  onSelection?: (selection: string) => void; // onSelection prop 추가
  onSelectionClick?: (selection: string) => void; // 클릭 이벤트
  hoveredSelection?: string | null; // 추가
}


const CreateAccordionItem: React.FC<CreateAccordionItemProps> = ({
  title,
  content,
  isActive,
  onClick,
  onSelection,
  onSelectionClick,
  hoveredSelection,
}) => {

  const handleMouseOver = (selection: string) => {
    onSelection?.(selection); // 선택된 항목 전달
  };

  const handleMouseLeave = () => {
    onSelection?.(''); // 마우스가 떠날 때 초기화
  };

  const handleItemClick = (item: string) => {
    // 항목 클릭 시 호출
    onSelectionClick?.(item);
  };


  return (
    
    <AccordionItem
      border="0"
      className={`${styles.selection} ${isActive ? styles.active : ''} `}
    >
      {content.length >= 0 ? (
        <div
        className={styles.mainSelection}
        >
          <AccordionButton
           onClick={onClick} // 제목 클릭 시 호출
           onMouseOver={() => handleMouseOver(title)} // 제목 호버 시 호출
           onMouseLeave={handleMouseLeave} // 마우스가 떠날 때 초기화
            className={styles.AccordionButton}
            style={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              justifyContent: content.length > 0 ? 'space-between' : 'flex-start',
            }}
          >
            <div
              className={styles.title}
              style={{ fontSize: '14px', textAlign: 'left' }}
            >
              {title}
            </div>
            {content.length > 0 && <AccordionIcon />}
          </AccordionButton>
        </div>
          ) : null} 

        {content.length > 0 ? (
          <AccordionPanel className={styles.sideSelection}>
            <div className={styles.secondSelections}>
              {content.map((item, index) => (
                <div
                  key={index}
                  className={`${styles.secondSelection} ${
                    hoveredSelection === item ? styles.hovered : '' // 상태에 따라 호버 클래스 적용
                  }`}
                  onMouseOver={() => handleMouseOver(item)} // 항목 호버 시 호출
                  onMouseLeave={handleMouseLeave} // 항목에서 마우스가 떠날 때 호출
                  onClick={() => handleItemClick(item)} // 항목 클릭 시 호출
                >
                  {item}
                </div>
              ))}
            </div>
          </AccordionPanel>
        ) : null}
    </AccordionItem>
  );
};

export default CreateAccordionItem;


