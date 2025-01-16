import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';

const Background0: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="#f5f5f5"  // 흰색에 가까운 회색
            gradientColor="#f0f0f0"    // 약간 더 진한 회색
            pattern="solid"
            opacity={1}
        />
    );
};

export default Background0; 