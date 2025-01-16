// 크리스탈 테마 배경
import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';
import styles from './Background5.module.css';

const Background5: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="#1a1a2e"
            gradientColor="#16213e"
            pattern="custom"
            opacity={1}
        >
            <div className={styles.background}>
                <div className={styles.crystalOverlay} />
                <div className={styles.crystalReflections} />
                <div className={styles.crystalGlow} />
            </div>
        </BackgroundItem>
    );
};

export default Background5; 