import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './IntermediateStudyMapPlacement.module.css';

// Components
import CreateCanvasMap from '../CreateCanvasMap/CreateCanvasMap';
import ActionMenu from '../ActionMenu/ActionMenu';
import CoinSwitcher from '../../components/CoinSwitcher/CoinSwitcher';
import ProfileComposition from '../../pages/ProfileComposition/ProfileComposition';

// Images
import IntermediateStudyMapImage from '../../image/Maps/IntermediateStudyMap.png';

declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => any;
};

const images = require.context('../../image', true, /\.(png|jpe?g|svg)$/);

const IntermediateStudyMapPlacement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());
  const [userName, setuserName] = useState("미 로그인");
  const [userStage, setuserStage] = useState("미 로그인");
  const [userImagePath, setUserImagePath] = useState("../../image/basic/skin1.png");

  const handleChapterChange = (chapterLabel: string) => {
    const chapterNumber = parseInt(chapterLabel, 10);
    setSelectedChapter(chapterNumber);
  };

  // ThemeStudyChapter로 이동하는 함수 추가
  const handleStageClick = (stage: string) => {
    const [chapter, stageNum] = stage.split('-');
    const stageId = `200-${chapter.padStart(2, '0')}${stageNum.padStart(2, '0')}`;  // 200으로 시작하는 중급 스테이지

    navigate('/tsc', {
      state: {
        mode: 'stage',
        identifier: stageId,
        level: 'intermediate'  // 난이도를 intermediate로 설정
      }
    });
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedNickname = sessionStorage.getItem('userNickname') || localStorage.getItem('userNickname');
        
        if (storedNickname) {
          setuserName(storedNickname);
        }

        const response = await fetch(`http://localhost:9999/api/user/getUserInfo?Difficulty=normal`, {  // Difficulty를 normal로 변경
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          if (!storedNickname) {
            setuserName(data[0]);
          }
          
          let stageValue = "1-1";
          if (data[1]) {
            stageValue = data[1];
          }
          setuserStage(stageValue);
          
          const [chapter] = stageValue.split('-');
          setSelectedChapter(parseInt(chapter, 10));

          if (data[2]) {
            try {
              setUserImagePath(images(data[2]));
            } catch (error) {
              console.error('Error loading image:', error);
              setUserImagePath(images('./basic/skin1.png'));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []);

  const stages = Array.from({ length: 10 }, (_, index) => `${selectedChapter}-${index + 1}`);

  return (
    <div>
      <div className={styles.mapImage}>
        <CreateCanvasMap imagePath={IntermediateStudyMapImage} />
      </div>
      <div className={styles.coins}>
        <div className={styles.mapGrid}>
          <div className={styles.coinMap}>
            <div className={styles.userContainer}>
              <div className={styles.userContainerInside}>
                <ProfileComposition />
              </div>
            </div>
            <div className={styles.chapter}>
              <div className={styles.menuButtonContainer}>
                <ActionMenu 
                  onChapterChange={handleChapterChange} 
                  initialChapter={selectedChapter.toString()}
                />
              </div>
            </div>

            {stages.map(stage => (
              <div 
                key={stage} 
                className={styles[`coin${stage.replace('-', '_')}`]}
                onClick={() => handleStageClick(stage)}  // 클릭 핸들러 추가
              >
                <CoinSwitcher 
                  questionNumber={stage} 
                  isCompleted={completedQuestions.has(stage)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntermediateStudyMapPlacement;