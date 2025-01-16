import React, { useState } from 'react';
import styles from './CreatePopOver.module.css';
import { useMainMap } from '../../components/MainMapProvider/MainMapProvider';


interface CreatePopOverProps {
  title: string;
  content: string;
  selection: string | null;
  direction: string;
  isReversed?: boolean;
}

const CreatePopOver: React.FC<CreatePopOverProps> = ({
  title,
  content,
  selection,
  direction,
  isReversed = false,
}) => {
  // const [isHovered, setIsHovered] = useState(false);
  const { hoveredSelection } = useMainMap(); // Context에서 상태 가져오기
  const isActive =
  (title === '학습하기' || title === '게임하기')
    ? hoveredSelection === content
    : hoveredSelection === title;

  return (
    <div
      className={`${styles.popOver} ${styles[direction]} ${
        isActive ? styles.active : ''
      } ${isReversed ? styles.reversed : ''}`}
    >
      <div className={styles.popOverInside}>
        {content} {title}
      </div>
    </div>
  );
};

export default CreatePopOver;
