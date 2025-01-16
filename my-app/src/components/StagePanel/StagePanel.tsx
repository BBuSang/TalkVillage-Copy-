import React, { useState } from 'react';
import styles from './StagePanel.module.css';
import ship from '../../image/Stage/ship.svg';
import coin from '../../image/Stage/coin.svg';
import ProfileComposition from '../../pages/ProfileComposition/ProfileComposition';

const stages = Array.from({ length: 10 }, (_, index) => index + 1);

export default function StagePanel() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStage = () => {
    if (currentStep < stages.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const stepPercentage = (currentStep / (stages.length - 1)) * 100;

  return (
    <div className={styles.stagePanel}>

      {/* 이 버튼을 누르면 단계가 이동함 필요에 따라 이용 하세요 */}
      {/* <div className={styles.stage}>
        <button onClick={nextStage}>다음 단계</button>
      </div> */}


      <div className={styles.progressContainer}>
        {/* 프로그레스 바 */}
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${stepPercentage}%` }}
          ></div>
        </div>

        {/* 단계 숫자 및 동전 아이콘 */}
        <div className={styles.stageMarkers}>
          {stages.map((step, index) => (
            <div key={step} className={styles.stageItem}>
              {/* 동전 아이콘 */}
              <img
                src={coin}
                alt="coin"
                className={styles.coinImage}
                style={{
                  opacity: currentStep > index-1 ? 0 : 1, // 해당 단계에 도달 시 동전이 사라짐
                }}
              />
              {/* 단계 숫자 */}
              <span className={styles.stageNumber}>{step}</span>
            </div>
          ))}
        </div>

        {/* ship 아이콘 */}
        <img
          src={ship}
          alt="ship"
          className={styles.personImage}
          style={{
            left: `calc(${stepPercentage}% - 15px)`, // 단계에 맞춰 ship 위치 조정
            zIndex: 1,
          }}
        />
      </div>
      <div>
        <ProfileComposition />
      </div>
    </div>
  );
}
