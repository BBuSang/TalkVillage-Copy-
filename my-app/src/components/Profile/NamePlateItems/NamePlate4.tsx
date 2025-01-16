// 푸른 하늘 컨셉
import React from 'react';
import NamePlateItem from '../NamePlateItem/NamePlateItem';

interface NamePlateProps {
    name: string;
}

const NamePlate4: React.FC<NamePlateProps> = ({ name }) => {
    return (
        <NamePlateItem 
            backgroundColor="rgba(51, 153, 255, 0.5)"
            borderColor="rgba(255, 255, 255, 0.95)"
            style="glass"
            glowEffect={true}
            glowColor="rgba(255, 255, 255, 0.7)"
            textColor="rgb(255, 255, 255)"
            fontWeight="600"
            borderWidth="2px"
            boxShadow="0 0 25px rgba(255, 255, 255, 0.4), inset 0 0 15px rgba(255, 255, 255, 0.3)"
            name={name}
        />
    );
};

export default NamePlate4; 