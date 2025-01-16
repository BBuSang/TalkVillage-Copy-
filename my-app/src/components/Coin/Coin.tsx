import React from "react";
import styles from "./Coin.module.css";

interface CoinProps {
  coinImage: string; // 코인 이미지 경로
  amount: number; // 현재 코인 수량
  unit?: string; // 화폐 단위 (기본값: "Toks")
  width?: string; // 전체 컨테이너 너비
  height?: string; // 전체 컨테이너 높이
  borderRadius?: string; // 모서리 둥글기
  backgroundColor?: string; // 배경색
}

const Coin: React.FC<CoinProps> = ({
  coinImage,
  amount,
  unit = "Toks", // 기본 화폐 단위
  width = "200%", // 기본 너비
  height = "20px", // 기본 높이
  borderRadius = "20px", // 기본 둥근 모서리
  backgroundColor = "rgba(249,253,255,0.8)", // 기본 배경색
}) => {
  // 숫자를 1,000 단위로 콤마 찍기
  const formattedAmount = new Intl.NumberFormat("ko-KR").format(amount);

  return (
    <div
      className={styles.coinContainer}
      style={{
        width,
        height,
        borderRadius,
      }}
    >
      <div className={styles.coinContainerInside}>
        <div
          className={styles.coinIconBox}
          style={{
            width: `calc(${height} * 0.8)`,
            height: `calc(${height} * 0.8)`,
            borderRadius,
          }}
        >
          <img
            src={coinImage}
            alt="coin"
            className={styles.coinImage}
            style={{
              width: "80%",
              height: "80%",
            }}
          />
        </div>
        <div className={styles.coinAmountBox}>
          <div className={styles.coinAmountBoxInside}>
            <div className={styles.coinAmount}>{formattedAmount}</div>
            <div className={styles.coinToks}>{unit}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coin;
