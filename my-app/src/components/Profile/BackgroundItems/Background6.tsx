import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';
import styles from './Background6.module.css';

const Background6: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="#0a0a1f"
            gradientColor="#0f0f2e"
            pattern="custom"
            opacity={1}
        >
            <div className={styles.background}>
                <div className={styles.frame}>
                    <div className={styles.borderEffect}></div>
                    <div className={styles.borderEffect} style={{animationDelay: '-4s'}}></div>
                    <div className={styles.borderEffect} style={{animationDelay: '-8s'}}></div>
                    <div className={styles.content}></div>
                </div>
            </div>
        </BackgroundItem>
    );
};

export default Background6; 