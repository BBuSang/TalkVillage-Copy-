import React, { useState } from 'react';
import styles from "./MainMapPlacement.module.css";
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용

// Components
import CreateCanvasMap from '../../components/CreateCanvasMap/CreateCanvasMap';
import PortalDisplayControl from '../../components/PortalDisplayControl/PortalDisplayControl';
import CreatePopOver from '../../components/CreatePopOver/CreatePopOver';
import { Player } from '@lottiefiles/react-lottie-player';
import { useMainMap } from '../../components/MainMapProvider/MainMapProvider';
import LoginDropdown from '../LoginDropdown/LoginDropdown';

// Images
import MainMapImage from '../../image/Maps/MainMap.png';

import CastleImage from '../../image/Buildings/StudyBuildings/Castle.png';
import BrownHouseImage from '../../image/Buildings/StudyBuildings/BrownHouse.png';
import ForestImage from '../../image/Buildings/StudyBuildings/Forest.png';
import BlueLightHouseImage from '../../image/Buildings/StudyBuildings/BlueLightHouse.png';
import RedLightHouseImage from '../../image/Buildings/StudyBuildings/RedLightHouse.png';

import PalmTreeImage from '../../image/Buildings/GameBuildings/PalmTree.png';
import TreasureImage from '../../image/Buildings/GameBuildings/Treasure.png';
import VolcanoImage from '../../image/Buildings/GameBuildings/Volcano.png';

import CaveImage from '../../image/Buildings/EctBuildings/Cave.png';
import ForestWithRoundTreeImage from '../../image/Buildings/EctBuildings/ForestWithRoundTree.png';
import RedHouseImage from '../../image/Buildings/EctBuildings/RedHouse.png';
import WaterFallImage from '../../image/Buildings/EctBuildings/Waterfall.png';


// animation
import birdAnimationData from '../../animation/birdAnimation.json'
import boat1AnimationData from '../../animation/boat1.json'
import boat2AnimationData from '../../animation/boat2.json'
import footPrintAnimationData from '../../animation/footPrint.json'
import cloudAnimationData from '../../animation/cloud.json'
import waveAnimationData from '../../animation/wave.json'
import wave2AnimationData from '../../animation/wave2.json'

const MainMapPlacement: React.FC = () => {
    const {
      hoveredSelection,
      setHoveredSelection,
      activeButton,
      setActiveButton,
      openAccordionIndex,
      setOpenAccordionIndex,
      selectedSelection,
      setSelectedSelection
    } = useMainMap();

    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleBuildingClick = (selection: string) => {
      // 빌딩 클릭 시 경로 이동
      switch (selection) {
        case '초급':
          navigate('/mainmap/beginnerStudymap'); // 초급 맵으로 이동
          break;
        case '중급':
          navigate('/mainmap/intermediateStudymap'); // 중급 맵으로 이동 (예시)
          break;
        case '고급':
          navigate('/mainmap/advancedStudymap'); // 고급 맵으로 이동 (예시)
          break;
        case '미디어':
          navigate('/clip');
          break;
        case '테마':
          navigate('/tsc');
          break;
        case '상점':
          navigate('/mainmap/store');
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
        case '영어사전':
          navigate('/dictionary');
          break;
        case '상점':
          navigate('/mainmap/store');
          break;
        case '시험':
          navigate('/mainmap/voca');
          break;
        default:
          navigate('/mainmap'); // 기본 맵으로 이동
          break;
      }
    };
  
    return (
      <div>
          <div className={styles.mapImage}>
            <CreateCanvasMap imagePath={MainMapImage} />
          </div>
          <div className={styles.birdAnimationContainer}>
              <Player
              autoplay
              loop
              src={birdAnimationData}
            />
          </div>
          <div className={styles.cloudAnimationContainer}>
              <Player
              autoplay
              loop
              src={cloudAnimationData}
            />
          </div>
        
          <div className={styles.buildings}>
            <div className={styles.mapGrid}>
              <div className={styles.buildingsMap}>

                <div className={styles.boat1AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={boat1AnimationData}
                  />
                </div>

                <div className={styles.boat2AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={boat2AnimationData}
                  />
                </div>

                <div className={styles.footPrintAnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={footPrintAnimationData}
                  />
                </div>
                <div className={styles.wave1AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={waveAnimationData}
                  />
                </div>
                <div className={styles.wave2AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={waveAnimationData}
                    speed={0.5} // 재생 속도 설정 (0.5배 느리게)
                  />
                </div>
                <div className={styles.wave3AnimationContainer}>
                  <Player 
                    autoplay
                    loop
                    src={waveAnimationData}
                    speed={0.2} 
                  />
                </div>
                <div className={styles.wave4AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={wave2AnimationData}
                    speed={0.5}
                  />
                </div>

                <div className={styles.wave5AnimationContainer}>
                  <Player
                    autoplay
                    loop
                    src={wave2AnimationData}
                    speed={0.3}
                  />
                </div>

                <div
                  className={`${styles.studyBuildingBeginner} ${
                    hoveredSelection === '초급' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('초급'); // 빌딩 호버 상태 업데이트
                    setActiveButton('학습하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(0); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('초급')} // 클릭하면 초급 맵으로 
                >
                  <CreateCanvasMap imagePath={CastleImage} />
                  {activeButton === '학습하기' && (
                    <>
                      <div className={styles.studyPortalBeginner}>
                        {(hoveredSelection === '초급' || selectedSelection === '초급') && (
                          <PortalDisplayControl title={activeButton} selection="초급" />
                        )}
                      </div>
                      <div className={styles.studyPopOverBeginner}>
                        <CreatePopOver
                          title={activeButton}
                          content="초급"
                          selection={hoveredSelection === '초급' ? '초급' : selectedSelection}
                          direction="bottom"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.studyBuildingIntermediate} ${
                    hoveredSelection === '중급' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('중급'); // 빌딩 호버 상태 업데이트
                    setActiveButton('학습하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(0); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('중급')}
                >
                  <CreateCanvasMap imagePath={BrownHouseImage} />
                  {activeButton === '학습하기' && (
                    <>
                      <div className={styles.studyPortalIntermediate}>
                        {(hoveredSelection === '중급' || selectedSelection === '중급') && (
                          <PortalDisplayControl title={activeButton} selection="중급" />
                        )}
                      </div>
                      <div className={styles.studyPopOverIntermediate}>
                        <CreatePopOver
                          title={activeButton}
                          content="중급"
                          selection={hoveredSelection === '중급' ? '중급' : selectedSelection}
                          direction="top"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.studyBuildingAdvanced} ${
                    hoveredSelection === '고급' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('고급'); // 빌딩 호버 상태 업데이트
                    setActiveButton('학습하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(0); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('고급')}
                >
                  <CreateCanvasMap imagePath={ForestImage} />
                  {activeButton === '학습하기' && (
                    <>
                      <div className={styles.studyPortalAdvanced}>
                        {(hoveredSelection === '고급' || selectedSelection === '고급') && (
                          <PortalDisplayControl title={activeButton} selection="고급" />
                        )}
                      </div>
                      <div className={styles.studyPopOverAdvanced}>
                        <CreatePopOver
                          title={activeButton}
                          content="고급"
                          selection={hoveredSelection === '고급' ? '고급' : selectedSelection}
                          direction="left"
                          isReversed={true}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.studyBuildingMedia} ${
                    hoveredSelection === '미디어' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('미디어'); // 빌딩 호버 상태 업데이트
                    setActiveButton('학습하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(0); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('미디어')}
                >
                  <CreateCanvasMap imagePath={BlueLightHouseImage} />
                  {activeButton === '학습하기' && (
                    <>
                      <div className={styles.studyPortalMedia}>
                        {(hoveredSelection === '미디어' || selectedSelection === '미디어') && (
                          <PortalDisplayControl title={activeButton} selection="미디어" />
                        )}
                      </div>
                      <div className={styles.studyPopOverMedia}>
                        <CreatePopOver
                          title={activeButton}
                          content="미디어"
                          selection={hoveredSelection === '미디어' ? '미디어' : selectedSelection}
                          direction="bottom"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.studyBuildingTheme} ${
                    hoveredSelection === '테마' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('테마'); // 빌딩 호버 상태 업데이트
                    setActiveButton('학습하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(0); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('테마')}
                >
                  <CreateCanvasMap imagePath={RedLightHouseImage} />
                  {activeButton === '학습하기' && (
                    <>
                      <div className={styles.studyPortalTheme}>
                        {(hoveredSelection === '테마' || selectedSelection === '테마') && (
                          <PortalDisplayControl title={activeButton} selection="테마" />
                        )}
                      </div>
                      <div className={styles.studyPopOverTheme}>
                        <CreatePopOver
                          title={activeButton}
                          content="테마"
                          selection={hoveredSelection === '테마' ? '테마' : selectedSelection}
                          direction="bottom"
                          isReversed = {true}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.gameBuilding1} ${
                    hoveredSelection === 'HangMan' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('HangMan'); // 빌딩 호버 상태 업데이트
                    setActiveButton('게임하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(1); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('HangMan')}
                >
                  <CreateCanvasMap imagePath={TreasureImage} />
                  {activeButton === '게임하기' && (
                    <>
                      <div className={styles.gamePortal1}>
                        {(hoveredSelection === 'HangMan' || selectedSelection === 'HangMan') && (
                          <PortalDisplayControl title={activeButton} selection="HangMan" />
                        )}
                      </div>
                      <div className={styles.gamePopOver1}>
                        <CreatePopOver
                          title={activeButton}
                          content="HangMan"
                          selection={hoveredSelection === 'HangMan' ? 'HangMan' : selectedSelection}
                          direction="bottom"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.gameBuilding2} ${
                    hoveredSelection === 'Scramble' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('Scramble'); // 빌딩 호버 상태 업데이트
                    setActiveButton('게임하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(1); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('Scramble')}
                >
                  <CreateCanvasMap imagePath={PalmTreeImage} />
                  {activeButton === '게임하기' && (
                    <>
                      <div className={styles.gamePortal2}>
                        {(hoveredSelection === 'Scramble' || selectedSelection === 'Scramble') && (
                          <PortalDisplayControl title={activeButton} selection="Scramble" />
                        )}
                      </div>
                      <div className={styles.gamePopOver2}>
                        <CreatePopOver
                          title={activeButton}
                          content="Scramble"
                          selection={hoveredSelection === 'Scramble' ? 'Scramble' : selectedSelection}
                          direction="top"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.gameBuilding3} ${
                    hoveredSelection === 'CrossWord' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('CrossWord'); // 빌딩 호버 상태 업데이트
                    setActiveButton('게임하기'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(1); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('CrossWord')}
                >
                  <CreateCanvasMap imagePath={VolcanoImage} />
                  {activeButton === '게임하기' && (
                    <>
                      <div className={styles.gamePortal3}>
                        {(hoveredSelection === 'CrossWord' || selectedSelection === 'CrossWord') && (
                          <PortalDisplayControl title={activeButton} selection="CrossWord" />
                        )}
                      </div>
                      <div className={styles.gamePopOver3}>
                        <CreatePopOver
                          title={activeButton}
                          content="CrossWord"
                          selection={hoveredSelection === 'CrossWord' ? 'CrossWord' : selectedSelection}
                          direction="bottom"
                          isReversed={true}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.dictionaryBuilding} ${
                    hoveredSelection === '영어사전' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('영어사전'); 
                    setActiveButton('영어사전'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(2); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('영어사전')}
                >
                  <CreateCanvasMap imagePath={CaveImage} />
                  {activeButton === '영어사전' && (
                    <>
                      <div className={styles.dictionaryPortal}>
                        {(hoveredSelection === '영어사전' || activeButton === '영어사전') && (
                          <PortalDisplayControl title={activeButton} selection={selectedSelection} />
                        )}
                      </div>
                      <div className={styles.dictionaryPopOver}>
                        <CreatePopOver
                          title={activeButton}
                          content=""
                          selection={hoveredSelection === '영어사전' ? '영어사전' : selectedSelection || activeButton}
                          direction="bottom"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.myPageBuilding} ${
                    hoveredSelection === '마이페이지' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('마이페이지'); 
                    setActiveButton('마이페이지'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(3); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('마이페이지')}
                >
                  <CreateCanvasMap imagePath={ForestWithRoundTreeImage} />
                  {activeButton === '마이페이지' && (
                    <>
                      <div className={styles.myPagePortal}>
                        {(hoveredSelection === '마이페이지' || activeButton === '마이페이지') && (
                          <PortalDisplayControl title={activeButton} selection={selectedSelection} />
                        )}
                      </div>
                      <div className={styles.myPagePopOver}>
                        <CreatePopOver
                          title={activeButton}
                          content=""
                          selection={hoveredSelection === '마이페이지' ? '마이페이지' : selectedSelection || activeButton}
                          direction="top"
                          isReversed={true}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.storeBuilding} ${
                    hoveredSelection === '상점' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('상점'); 
                    setActiveButton('상점'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(4); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('상점')}
                >
                  <CreateCanvasMap imagePath={RedHouseImage} />
                  {activeButton === '상점' && (
                    <>
                      <div className={styles.storePortal}>
                        {(hoveredSelection === '상점' || activeButton === '상점') && (
                          <PortalDisplayControl title={activeButton} selection={selectedSelection} />
                        )}
                      </div>
                      <div className={styles.storePopOver}>
                        <CreatePopOver
                          title={activeButton}
                          content=""
                          selection={hoveredSelection === '상점' ? '상점' : selectedSelection || activeButton}
                          direction="left"
                          isReversed={true}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div
                  className={`${styles.testBuilding} ${
                    hoveredSelection === '시험' ? styles.hovered : ''
                  }`}
                  onMouseEnter={() => {
                    setHoveredSelection('시험'); 
                    setActiveButton('시험'); // 아코디언 버튼 활성화
                    setOpenAccordionIndex(5); // 첫 번째 패널 열기
                  }}
                  onMouseLeave={() => setHoveredSelection(null)}
                  onClick={() => handleBuildingClick('시험')}
                >
                  <CreateCanvasMap imagePath={WaterFallImage} />
                  {activeButton === '시험' && (
                    <>
                      <div className={styles.testPortal}>
                        {(hoveredSelection === '시험' || activeButton === '시험') && (
                          <PortalDisplayControl title={activeButton} selection={selectedSelection} />
                        )}
                      </div>
                      <div className={styles.testPopOver}>
                        <CreatePopOver
                          title={activeButton}
                          content=""
                          selection={hoveredSelection === '시험' ? '시험' : selectedSelection || activeButton}
                          direction="bottom"
                          isReversed={true}
                        />
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>

          </div>
      </div>
    );
};

export default MainMapPlacement;