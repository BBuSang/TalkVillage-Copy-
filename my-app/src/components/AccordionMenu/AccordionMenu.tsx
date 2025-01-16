import React from 'react';
import { Accordion } from '@chakra-ui/react';
import CreateAccordionItem from '../CreateAccordionItem/CreateAccordionItem';
import styles from './AccordionMenu.module.css';
import { useMainMap } from '../../components/MainMapProvider/MainMapProvider';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용

const AccordionMenu: React.FC = () => {
  const {
    openAccordionIndex,
    setOpenAccordionIndex,
    activeButton,
    setActiveButton,
    hoveredSelection,
    setHoveredSelection,
  } = useMainMap();

  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleNavigation = (selection: string) => {
    switch (selection) {
      case '초급':
        navigate('/MainMap/BeginnerStudymap');
        break;
      case '중급':
        navigate('/mainmap/intermediateStudymap');
        break;
      case '고급':
        navigate('/mainmap/advancedStudymap');
        break;
      case '미디어':
        navigate('/mainmap/media');
        break;
      case '테마':
        navigate('/mainmap/theme');
        break;
      case 'HangMan':
        navigate('/hangman');
        break;
      case 'Scramble':
        navigate('/WordScrambleGame');
        break;
      case 'CrossWord':
        navigate('/CrossWord');
        break;
      default:
        navigate('/mainmap');
        break;
    }
  };
  

  return (
    <div className={styles.insideMiddle}>
      <Accordion
        allowToggle
        border="0"
        className={styles.selectionBoxes}
        index={openAccordionIndex !== null ? [openAccordionIndex] : undefined}
        defaultIndex={activeButton === '학습하기' ? [0] : []}
      >
        {/* 학습하기 */}
        <div>
          <CreateAccordionItem
            title="학습하기"
            content={['초급', '중급', '고급', '미디어', '테마']}
            isActive={activeButton === '학습하기'}
            onClick={() => {
              setOpenAccordionIndex(0); // 패널 열기
              setActiveButton('학습하기'); // '학습하기' 활성화
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('학습하기');
            }}
            onSelectionClick={(selection) => {
              handleNavigation(selection); // 클릭 시 이동
              // console.log('클릭함');
            }}
            hoveredSelection={hoveredSelection}
          />
        </div>
        
        <div>
           <CreateAccordionItem
            title="게임하기"
            content={['HangMan', 'Scramble', 'CrossWord']}
            isActive={activeButton === '게임하기'}
            onClick={() => {
              setOpenAccordionIndex(1);
              setActiveButton('게임하기');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('게임하기');
            }}
            onSelectionClick={(selection) => {
              handleNavigation(selection);
            }}
            hoveredSelection={hoveredSelection}
          />
        </div>

        {/* 영어사전 */}
        <div>
          <CreateAccordionItem
            title="영어사전"
            content={[]}
            isActive={activeButton === '영어사전'}
            onClick={() => {
              setOpenAccordionIndex(2);
              setActiveButton('영어사전');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('영어사전');
            }}
          />
        </div>

        {/* 마이페이지 */}
        <div>
          <CreateAccordionItem
            title="마이페이지"
            content={[]}
            isActive={activeButton === '마이페이지'}
            onClick={() => {
              setOpenAccordionIndex(3);
              setActiveButton('마이페이지');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('마이페이지');
            }}
          />
        </div>

        {/* 상점 */}
        <div>
          <CreateAccordionItem
            title="상점"
            content={[]}
            isActive={activeButton === '상점'}
            onClick={() => {
              setOpenAccordionIndex(4);
              setActiveButton('상점');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('상점');
            }}
          />
        </div>

        {/* 시험 */}
        <div>
          <CreateAccordionItem
            title="시험"
            content={[]}
            isActive={activeButton === '시험'}
            onClick={() => {
              setOpenAccordionIndex(5);
              setActiveButton('시험');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('시험');
            }}
          />
        </div>
      </Accordion>
    </div>
  );
};

export default AccordionMenu;
