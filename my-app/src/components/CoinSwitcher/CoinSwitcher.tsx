import React from 'react';
import styles from './CoinSwitcher.module.css';
import CreateCanvasMap from '../CreateCanvasMap/CreateCanvasMap';

// Images
import GoldCoin from '../../image/Ect/GoldCoinImageForMap.png';
import SliverCoin from '../../image/Ect/SliverCoinImageForMap.png';
import SliverCoinPortal from '../../image/Portal/SliverCoinPortal.png';

interface CoinSwitcherProps {
  questionNumber: string;
  isCompleted: boolean;
}

const CoinSwitcher: React.FC<CoinSwitcherProps> = ({ questionNumber, isCompleted }) => {
  return (
    <div>
      <div className={styles.coinContainer}>
        {isCompleted ? (
          <div className={styles.goldCoin}>
            <CreateCanvasMap imagePath={GoldCoin} />
          </div>
        ) : (
          <div className={styles.sliverCoin}>
            <CreateCanvasMap imagePath={SliverCoin} />
          </div>
        )}
        <div className={styles.stageContainer}>
          <div className={styles.stage}>{questionNumber}</div>
        </div>
        <div className={styles.PortalContainer}>
          {isCompleted ? (
            <div className={styles.goldCoinPortal}>

            </div>
          ) : (
            <div className={styles.sliverCoinPortal}>
              <CreateCanvasMap imagePath={SliverCoinPortal} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoinSwitcher;
