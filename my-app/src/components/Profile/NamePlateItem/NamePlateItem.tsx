import React from 'react';
import styles from './NamePlateItem.module.css';

interface NamePlateItemProps {
    backgroundColor: string;
    borderColor: string;
    style: 'glass' | 'metallic' | 'solid' | 'crystal';
    glowEffect: boolean;
    glowColor?: string;
    textColor?: string;
    fontWeight?: string;
    borderWidth?: string;
    name: string;
    cursor?: string;
    boxShadow?: string;
    fontSize?: string;
    textShadow?: string;
}

const NamePlateItem: React.FC<NamePlateItemProps> = ({
    backgroundColor,
    borderColor,
    style,
    glowEffect,
    glowColor,
    textColor = '#ffffff',
    fontWeight = 'normal',
    borderWidth = '2px',
    fontSize = '1.7em',
    name,
    cursor,
    boxShadow,
    textShadow
}) => {
    const getStyleProperties = () => {
        switch (style) {
            case 'crystal':
                return {
                    background: `linear-gradient(135deg, 
                        rgba(255,255,255,0.4) 0%, 
                        rgba(255,255,255,0.1) 50%, 
                        rgba(255,255,255,0.4) 100%)`,
                    backdropFilter: 'blur(5px)',
                    WebkitBackdropFilter: 'blur(5px)',
                    boxShadow: boxShadow
                };
            case 'glass':
                return {
                    background: `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)) ${backgroundColor}`
                };
            default:
                return {};
        }
    };

    return (
        <div
            className={styles.namePlate}
            style={{
                padding: '10px 20px',
                backgroundColor,
                border: `${borderWidth} solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontWeight,
                boxShadow: glowEffect 
                    ? `0 0 10px ${glowColor || borderColor}, 
                       inset 0 0 10px ${glowColor || borderColor}`
                    : 'none',
                background: style === 'metallic' 
                    ? `linear-gradient(145deg, ${backgroundColor} 0%, #fff6c8 45%, ${backgroundColor} 100%)`
                    : style === 'glass'
                    ? `linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)) ${backgroundColor}`
                    : backgroundColor,
                textAlign: 'center',
                fontSize: fontSize,
                letterSpacing: '2px',
                textShadow: textShadow || '0 2px 4px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease',
                cursor: cursor,
                fontFamily: "'Noto Sans KR', sans-serif",
                ...getStyleProperties()
            }}
        >
            {name}
        </div>
    );
};

export default NamePlateItem; 