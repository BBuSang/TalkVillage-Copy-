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
                    fontSize="1.3em"
                    name="로그인하러가기"
                />
            </div>
        );
    }

    return (
        <NamePlateItem 
            backgroundColor="#ffffff"
            borderColor="#e0e0e0"
            style="solid"
            textColor="black"
            glowEffect={false}
            name={name}
        />
    );
};

export default NamePlate0; 