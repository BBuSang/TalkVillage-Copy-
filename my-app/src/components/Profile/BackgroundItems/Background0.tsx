import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';

const Background0: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="rgba(224, 238, 250, 0.4)"  // 흰색에 가까운 회색
            gradientColor="rgba(224, 238, 250, 0.4)"    // 약간 더 진한 회색
            pattern="solid"
            opacity={1}
        />
    );
};

export default Background0; 