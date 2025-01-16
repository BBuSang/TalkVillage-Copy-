import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BeginnerStudyMapPlacement.module.css';

// Components
import CreateCanvasMap from '../CreateCanvasMap/CreateCanvasMap';
import ActionMenu from '../ActionMenu/ActionMenu';
import CoinSwitcher from '../../components/CoinSwitcher/CoinSwitcher';
import ProfileComposition from '../../pages/ProfileComposition/ProfileComposition';

// Images
import BeginnerStudyMapImage from '../../image/Maps/BeginnerStudyMap.png';

// require.context 타입 선언 추가
declare const require: {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ) => any;
};

// 이미지 context 설정
const images = require.context('../../image', true, /\.(png|jpe?g|svg)$/);

const BeginnerStudyMapPlacement: React.FC = () => {

  // 챕터와 스테이지 관리
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  // 기본값 설정 이걸로 해놨는데 원하는걸로 바꾸면 됩니다
  const [userName, setuserName] = useState("미 로그인"); 
  const [userStage, setuserStage] = useState("미 로그인");
  // 유저 이미지 경로 상태 추가
  const [userImagePath, setUserImagePath] = useState("../../image/basic/skin1.png");

  const handleChapterChange = (chapterLabel: string) => {
    const chapterNumber = parseInt(chapterLabel, 10); // '2' → 숫자 변환
    setSelectedChapter(chapterNumber);
  };

//   const handleStageClick = (stage: string) => {
//     navigate(`/question/${stage}`); // 예: /question/2-1
//   };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 먼저 세션/로컬 스토리지에서 닉네임 확인
        const storedNickname = sessionStorage.getItem('userNickname') || localStorage.getItem('userNickname');
        
        if (storedNickname) {
          setuserName(storedNickname);
        }

        const response = await fetch(`http://localhost:9999/api/user/getUserInfo?Difficulty=easy`, { 
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          // 스토리지에 닉네임이 없을 경우에만 API 응답의 닉네임을 사용
          if (!storedNickname) {
            setuserName(data[0]);
          }
          
          // 스테이지 값 처리
          let stageValue = "1-1";
          if (data[1]) {
            stageValue = data[1];
          }
          setuserStage(stageValue);
          
          // 스테이지 값을 챕터와 스테이지로 분리
          const [chapter] = stageValue.split('-');
          setSelectedChapter(parseInt(chapter, 10));

          // 이미지 경로 설정 (data[2]에 이미지 경로가 있다고 가정)
          if (data[2]) {
            try {
              // 이미지 경로 처리 수정
              setUserImagePath(images(data[2]));
            } catch (error) {
              console.error('Error loading image:', error);
              setUserImagePath(images('./basic/skin1.png')); // 기본 이미지
            }
          }
        } else if(response.status == 250){
          // 여기는 로그인이 되어있지 않을때
        }
      } catch (err) {
        console.error('Error fetching user info:', err);
      }
    };

    fetchUserInfo();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

  const stages = Array.from({ length: 10 }, (_, index) => `${selectedChapter}-${index + 1}`);

  return (
    <div>
      <div className={styles.mapImage}>
        <CreateCanvasMap imagePath={BeginnerStudyMapImage} />
      </div>
      <div className={styles.coins}>
        <div className={styles.mapGrid}>
          <div className={styles.coinMap}>
            <div className={styles.userContainer}>
              <ProfileComposition />
            </div>
            <div className={styles.chapter}>
              <div className={styles.menuButtonContainer}>
                <ActionMenu 
                  onChapterChange={handleChapterChange} 
                  initialChapter={selectedChapter.toString()}  // 현재 챕터 전달
                />
              </div>
            </div>

            {stages.map(stage => (
                <div 
                    key={stage} 
                    className={styles[`coin${stage.replace('-', '_')}`]} 
                    // onClick={() => handleStageClick(stage)} 
                >
                    <CoinSwitcher questionNumber={stage} isCompleted={completedQuestions.has(stage)} />
                </div>
            ))}

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerStudyMapPlacement;
