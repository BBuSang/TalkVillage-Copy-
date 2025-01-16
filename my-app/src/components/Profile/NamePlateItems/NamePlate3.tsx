import React from 'react';
import NamePlateItem from '../NamePlateItem/NamePlateItem';

interface NamePlateProps {
    name: string;
}

const NamePlate3: React.FC<NamePlateProps> = ({ name }) => {
    return (
        <NamePlateItem 
            backgroundColor="rgba(15, 25, 60, 0.7)"
            borderColor="rgba(100, 200, 255, 0.8)"
            style="glass"
            glowEffect={true}
            glowColor="rgba(100, 200, 255, 0.5)"
            textColor="rgb(200, 230, 255)"
            fontWeight="600"
            borderWidth="2px"
            boxShadow="0 0 20px rgba(100, 200, 255, 0.3), inset 0 0 15px rgba(100, 200, 255, 0.2)"
            textShadow="0 0 10px rgba(200, 230, 255, 0.8),
                       0 0 20px rgba(200, 230, 255, 0.5),
                       0 0 30px rgba(200, 230, 255, 0.3)"
            name={name}
        />
    );
};

export default NamePlate3; 