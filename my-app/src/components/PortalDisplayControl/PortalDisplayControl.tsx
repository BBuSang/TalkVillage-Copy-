import React from 'react';
import styles from './PortalDisplayControl.module.css';
import CreatePortalEffect from '../../components/CreatePortalEffect/CreatePortalEffect';

interface PortalDisplayControlProps {
  title: string;
  selection: string | null;
}

const PortalDisplayControl: React.FC<PortalDisplayControlProps> = ({ title, selection }) => {
  // 공통 렌더링 함수
  const renderPortal = (styleClass: string) => (
    <div className={`${styleClass} ${styles.active}`}>
      <CreatePortalEffect />
    </div>
  );

  // 포털 렌더링 조건 처리
  const getPortalStyleClass = () => {
    if (title === '학습하기') {
      switch (selection) {
        case '초급':
          return styles.studyPortalBeginner;
        case '중급':
          return styles.studyPortalIntermediate;
        case '고급':
          return styles.studyPortalAdvanced;
        case '미디어':
          return styles.studyPortalMedia;
        case '테마':
          return styles.studyPortalTheme;
        default:
          return null;
      }
    }

    if (title === '게임하기') {
      switch (selection) {
        case '게임1':
          return styles.gamePortal1;
        case '게임2':
          return styles.gamePortal2;
        case '게임3':
          return styles.gamePortal3;
        default:
          return null;
      }
    }

    if (!selection) {
      switch (title) {
        case '영어사전':
          return styles.dictionaryPortal;
        case '마이페이지':
          return styles.myPagePortal;
        case '상점':
          return styles.storePortal;
        case '시험':
          return styles.testPortal;
        default:
          return null;
      }
    }

    return null;
  };

  const portalStyleClass = getPortalStyleClass();
  return portalStyleClass ? renderPortal(portalStyleClass) : null;
};

export default PortalDisplayControl;
