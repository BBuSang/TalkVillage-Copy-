import React from 'react';
import BackgroundItem from '../BackgroundItem/BackgroundItem';

const Background2: React.FC = () => {
    return (
        <BackgroundItem 
            backgroundColor="transparent"
            gradientColor="transparent"
            pattern="image"
            opacity={1}
            backgroundImage={'/Background/space.png'}
        />
    );
};

export default Background2; 