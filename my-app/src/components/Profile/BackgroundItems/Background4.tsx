import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';
import styles from './Background4.module.css';

const Background4: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="#FFDF00"
            gradientColor="#FFD700"
            pattern="custom"
            opacity={1}
        >
            <div className={styles.background}>
                <div className={styles.goldenOverlay} />
                <div className={styles.sparkles} />
                <div className={styles.goldenLight} />
                <div className={styles.crystalReflections} />
            </div>
        </BackgroundItem>
    );
};

export default Background4; 