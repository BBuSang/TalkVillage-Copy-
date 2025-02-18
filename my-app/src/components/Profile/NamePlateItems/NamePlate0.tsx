import React from 'react';
import { useNavigate } from 'react-router-dom';
import NamePlateItem from '../NamePlateItem/NamePlateItem';

interface NamePlate0Props {
    name: string;
}

const NamePlate0: React.FC<NamePlate0Props> = ({ name }) => {
    const navigate = useNavigate();

    if (name ==='null') {
        return (
            <div onClick={() => navigate('/login')}>
                <NamePlateItem 
                    backgroundColor="#ffffff"
                    borderColor="#e0e0e0"
                    style="solid"
                    textColor="black"
                    glowEffect={false}
                    cursor="pointer"
                    fontWeight="bold"
                    fontSize="0.6rem"
                    name="sign in"
                />
            </div>
        );
    }

    return (
        <NamePlateItem 
            backgroundColor=" rgba(224, 238, 250, 0.8)"
            borderColor="#507FB2"
            style="solid"
            // textColor="black"
            glowEffect={false}
            name={name}
            textColor = "#083349"
            textShadow = "none"
            fontWeight ="600"

        />
    );
};

export default NamePlate0; 