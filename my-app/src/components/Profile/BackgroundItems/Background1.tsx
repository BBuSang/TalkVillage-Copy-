import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';

const Background1: React.FC = () => {
    return (
        <BackgroundItem
            backgroundColor="transparent"
            gradientColor="transparent"
            pattern="image"
            opacity={1}
            backgroundImage={'/Background/SkyBlue.png'}
        />
    );
};

export default Background1; 