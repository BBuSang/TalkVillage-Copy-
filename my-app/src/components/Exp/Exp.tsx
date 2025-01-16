import React from "react";
import styles from "./Exp.module.css";

interface ExpProps {
  currentExp: number; // 현재 경험치
  expTable: number[]; // 누적 경험치 테이블
  segments: number; // 경험치 바의 세그먼트 수
  width?: string; // 너비 (기본값: 160%)
  height?: string; // 높이 (기본값: 20px)
  borderRadius?: string; // 모서리 둥글기
  backgroundColor?: string; // 배경색
  segmentBorderColor?: string; // 세그먼트 경계선 색상
}

const Exp: React.FC<ExpProps> = ({
  currentExp,
  expTable,
  segments,
  width = "160%", // 기본 너비
  height = "20px", // 기본 높이
  borderRadius = height, // 기본 둥근 모서리
  backgroundColor = "rgba(249,253,255,0.8)", // 기본 배경색
  segmentBorderColor = "#ccc", // 기본 점선 색상
}) => {

  // 현재 레벨 계산 (시작 레벨 1)
  const levelIndex = expTable.findIndex((exp) => currentExp < exp);
  const currentLevel = levelIndex === -1 ? expTable.length : levelIndex + 1; // 시작 레벨 1부터

  // 현재 레벨에서의 경험치 계산
  const levelStartExp = expTable[currentLevel - 2] || 0; // 현재 레벨 시작 경험치 (레벨 1일 때는 0)
  const levelEndExp = expTable[currentLevel - 1] || 1; // 다음 레벨 경험치
  const progress =
    ((currentExp - levelStartExp) / (levelEndExp - levelStartExp)) * 100; // 퍼센트 계산

  // 세그먼트 채우기 계산
  const filledSegments = Math.floor((progress / 100) * segments);

  return (
    <div
      className={styles.expContainer}
      style={{
        width,
        height,
        borderRadius,
      }}
    >
      <div className={styles.expContainerInside}>
        {/* 레벨 표시 */}
        <div
          className={styles.levelContainer}
          style={{
            width: `calc(${height} * 0.8)`,
            height: `calc(${height} * 0.8)`,
            borderRadius,
            backgroundColor,
          }}
        >
          <div className={styles.level}>{currentLevel}</div>
        </div>

        {/* 경험치 바 */}
        <div
          className={styles.expBox}
          style={{
            height: `calc(${height} * 0.8)`,
            borderRadius,
            backgroundColor,
            padding: "0 2px", // 왼쪽과 오른쪽에 2px 여백
          }}
        >
          {Array.from({ length: segments }).map((_, index) => (
            <div
              key={index}
              className={styles.segment}
              style={{
                // 세그먼트 색상 설정
                backgroundColor: index < filledSegments ? "#4caf50" : "transparent", // 채워진 세그먼트 색상

                // 점선 제거 조건
                borderRight: index < filledSegments ? "none" : `1.2px dotted ${segmentBorderColor}`,

                // 둥근 모서리 설정
                borderRadius:
                  filledSegments === 1 && index === 0 // 첫 번째 세그먼트만 채워졌을 때
                    ? `${borderRadius} ${borderRadius} ${borderRadius} ${borderRadius}` // 모든 모서리 둥글게
                    : index === 0 && filledSegments > 0 // 첫 번째 세그먼트가 채워졌을 때
                    ? `${borderRadius} 0 0 ${borderRadius}` // 왼쪽 모서리만 둥글게
                    : index === filledSegments - 1 // 마지막으로 채워진 세그먼트
                    ? `0 ${borderRadius} ${borderRadius} 0` // 오른쪽 모서리만 둥글게
                    : "0", // 나머지 세그먼트는 둥글기 없음
              }}
            ></div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default Exp;
