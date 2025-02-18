import React, { useState } from 'react';
import styles from './StagePanel.module.css';
import ship from '../../image/Stage/ship.svg';

// stages 배열 생성
// stages는 ClipPagePanel에서 동적으로 받아옵니다.

interface StagePanelProps {
  State: string | null;
  currentStep: number;
  totalStages: number; // stages의 총 개수를 받음
}

export default function StagePanel({ State, currentStep, totalStages }: StagePanelProps) {
  const stepPercentage = (currentStep / (totalStages - 1)) * 100;

  return (
    <div className={styles.stagePanel}>
      <div className={styles.progressContainer}>
        {/* 프로그레스 바 */}
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${stepPercentage}%` }}
          ></div>
        </div>
        
        

        {/* 단계 숫자 */}
        <div className={styles.stageMarkers}>
          {Array.from({ length: totalStages }, (_, index) => index + 1).map((step) => (
            <div key={step} className={styles.stageItem}>
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
    </div>
  );
}
