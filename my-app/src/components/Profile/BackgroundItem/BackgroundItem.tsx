import React from 'react';
import styles from './BackgroundItem.module.css';

interface BackgroundItemProps {
  backgroundColor: string;
  gradientColor: string;
  pattern: string;
  opacity: number;
  backgroundImage?: string;
  children?: React.ReactNode;
}

const BackgroundItem: React.FC<BackgroundItemProps> = ({ 
  backgroundColor, 
  gradientColor, 
  pattern, 
  opacity,
  backgroundImage,
  children
}) => {
  return (
    <div className={styles.background} style={{
      backgroundColor,
      background: backgroundImage 
        ? `url(${backgroundImage}) no-repeat center center / cover`
        : `linear-gradient(${backgroundColor}, ${gradientColor})`,
      opacity
    }}>
      {children}
    </div>
  );
};

export default BackgroundItem; 