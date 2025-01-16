// 북극광 오로라 컨셉 (프리미엄)
import React from 'react';
import NamePlateItem from '../NamePlateItem/NamePlateItem';
import styles from './NamePlate5.module.css';

interface NamePlateProps {
    name: string;
}

const NamePlate5: React.FC<NamePlateProps> = ({ name }) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.aurora} />
            <NamePlateItem 
                backgroundColor="rgba(2, 10, 32, 0.85)"
                borderColor="rgba(32, 55, 95, 0.8)"
                style="glass"
                glowEffect={true}
                glowColor="rgba(100, 200, 255, 0.6)"
                textColor="rgb(255, 250, 230)"                 // 노란빛이 도는 하얀색
                fontWeight="600"
                borderWidth="2px"
                boxShadow="0 0 25px rgba(100, 200, 255, 0.4), inset 0 0 20px rgba(100, 200, 255, 0.2)"
                name={name}
                textShadow="0 0 10px rgba(255, 250, 230, 0.8),
                           0 0 20px rgba(255, 250, 230, 0.5),
                           0 0 30px rgba(255, 250, 230, 0.3)"  // 글로우도 같은 색상으로
            />
        </div>
    );
};

export default NamePlate5; 