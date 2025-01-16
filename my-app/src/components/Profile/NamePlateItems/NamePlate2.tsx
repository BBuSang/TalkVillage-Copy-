import React from 'react';
import NamePlateItem from '../NamePlateItem/NamePlateItem';

interface NamePlate1Props {
    name: string;
}

const NamePlate2: React.FC<NamePlate1Props> = ({ name }) => {
    return (
        <NamePlateItem 
            backgroundColor="rgba(173, 216, 230, 0.3)"
            borderColor="rgba(255, 255, 255, 0.8)"
            style="crystal"
            glowEffect={true}
            textColor="white"
            fontWeight="600"
            borderWidth="2px"
            boxShadow="0 0 15px rgba(135, 206, 235, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)"
            name={name}
        />
    );
};

export default NamePlate2; 