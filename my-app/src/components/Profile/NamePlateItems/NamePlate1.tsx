import React from 'react';
import NamePlateItem from '../NamePlateItem/NamePlateItem';

interface NamePlate1Props {
    name: string;
}

const NamePlate1: React.FC<NamePlate1Props> = ({ name }) => {
    return (
        <NamePlateItem 
            backgroundColor="#FFD700"
            borderColor="#B8860B"
            style="metallic"
            glowEffect={true}
            glowColor="#FFF3B0"
            textColor="#000000"
            fontWeight="bold"
            borderWidth="3px"
            name={name}
        />
    );
};

export default NamePlate1; 