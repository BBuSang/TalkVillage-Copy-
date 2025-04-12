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
        navigate('/clip');
        break;
      case '테마':
        navigate('/tsc');
        break;
      case 'HangMan':
        navigate('/mainmap/hangman');
        break;
      case 'Scramble':
        navigate('/mainmap/WordScrambleGame');
        break;
      case 'CrossWord':
        navigate('/mainmap/CrossWord');
        break;
      case '단어장':
        navigate('/mainmap/voca');
        break;
      default:
        navigate('/mainmap');
        break;
    }
  };
  const handleNavigation2 = (selection: string) => {
    switch (selection) {
      case '상점':
        navigate('/mainmap/store');
        break;
      case '시험':
        navigate('/exam');
        break;
      case '마이페이지':
        navigate('/mainmap/mypage');
        break;
      case '영어사전':
        navigate('/dictionary');
        break;
      case '커뮤니티':
        navigate('/mainmap/community');
        break;
      default:
        navigate('/mainmap');
        break;
    }
  };

  const handleNavigationforMainMap = (selection: string) => {
    if (selection === '공부하기' || '게임하기') {
      navigate('/mainmap');
    }
  }

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
              handleNavigationforMainMap('학습하기'); // 타이틀버튼 눌렀을때 메인맵으로
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
              handleNavigationforMainMap('게임하기'); // 타이틀버튼 눌렀을때 메인맵으로
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
              handleNavigation2('영어사전');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('영어사전');
            }}
          />
        </div>

        {/* 마이페이지 */}
        {/* <div>
          <CreateAccordionItem
            title="마이페이지"
            content={[]}
            isActive={activeButton === '마이페이지'}
            onClick={() => {
              setOpenAccordionIndex(3);
              handleNavigation2('마이페이지');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('마이페이지');
            }}
          />
        </div> */}

        {/* 상점 */}
        <div>
          <CreateAccordionItem
            title="상점"
            content={[]}
            isActive={activeButton === '상점'}
            onClick={() => {
              setOpenAccordionIndex(4);
              handleNavigation2('상점');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('상점');
            }}
            hoveredSelection={hoveredSelection}
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
              handleNavigation2('시험');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('시험');
            }}
          />
        </div>

        <div>
          <CreateAccordionItem
            title="단어장"
            content={[]}
            isActive={activeButton === '단어장'}
            onClick={() => {
              setOpenAccordionIndex(6);
              handleNavigation('단어장');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('단어장');
            }}
            hoveredSelection={hoveredSelection}
          />
        </div>

        <div>
          <CreateAccordionItem
            title="커뮤니티"
            content={[]}
            isActive={activeButton === '커뮤니티'}
            onClick={() => {
              setOpenAccordionIndex(7);
              setActiveButton('커뮤니티');
            }}
            onSelection={(selection) => {
              setHoveredSelection(selection);
              setActiveButton('커뮤니티');
            }}
          />
        </div>

      </Accordion>
    </div>
  );
};

export default AccordionMenu;
