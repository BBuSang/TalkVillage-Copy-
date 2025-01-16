import React from 'react';
import { useDrag } from 'react-dnd';
import styles from '../DetailThemePanel/DetailThemePanel.module.css';

interface AnimationStyles {
  toX: number;
  toY: number;
  initialX: number;
  initialY: number;
}

interface DraggableWordProps {
  id: string;
  index: number;
  content: string;
  source: "available" | "sentence";
  className?: string;
  onClick?: (element: HTMLElement) => void;
  animationStyles?: AnimationStyles | null;
}

const DraggableWord: React.FC<DraggableWordProps> = ({
  id,
  index,
  content,
  source,
  className,
  onClick,
  animationStyles
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'WORD',
    item: { id, index, source },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(event.currentTarget);
    }
  };

  const style: React.CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    cursor: 'move',
    ...(animationStyles && {
      '--translate-x': `${animationStyles.toX}px`,
      '--translate-y': `${animationStyles.toY}px`,
      '--initial-x': `${animationStyles.initialX}px`,
      '--initial-y': `${animationStyles.initialY}px`
    })
  } as React.CSSProperties;

  return (
    <div
      ref={drag}
      className={className}
      style={style}
      onClick={handleClick}
      data-word-id={id}
    >
      {content}
    </div>
  );
};

export default DraggableWord;