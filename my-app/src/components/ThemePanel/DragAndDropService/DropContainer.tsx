import React, { useRef } from "react";
import { Box, Text } from "@chakra-ui/react";
import { useDrop } from "react-dnd";
import DraggableWord from "./DraggableWord";
import styles from "../DetailThemePanel/DetailThemePanel.module.css";

interface Word {
  id: string;
  content: string;
  index?: number;
}

interface DragItem {
  id: string;
  index: number;
  source: "available" | "sentence";
}

interface AnimationStyles {
  toX: number;
  toY: number;
  initialX: number;
  initialY: number;
}

interface DropContainerProps {
  target: "available" | "sentence";
  words: Word[];
  onDrop: (
    item: DragItem,
    target: "available" | "sentence",
    dropIndex: number | null
  ) => void;
  isSortable: boolean;
  message: string;
  movingWord: string | null;
  onWordClick?: (wordId: string, source: "available" | "sentence", element: HTMLElement) => void;
  animationStyles?: AnimationStyles | null;
}

const DropContainer: React.FC<DropContainerProps> = ({
  target,
  words,
  onDrop,
  isSortable,
  message,
  movingWord,
  animationStyles,
  onWordClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { isOver: boolean; canDrop: boolean }
  >({
    accept: "WORD",
    canDrop: (item, monitor) => {
      if (target === "sentence") {
        if (!containerRef.current) return false;

        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return false;

        const children = Array.from(
          containerRef.current.querySelectorAll(`[class*="${styles.draggableWord}"]`)
        );
        return children.some((child) => {
          const rect = (child as HTMLElement).getBoundingClientRect();
          return (
            clientOffset.x >= rect.left &&
            clientOffset.x <= rect.right &&
            clientOffset.y >= rect.top &&
            clientOffset.y <= rect.bottom
          );
        });
      }
      return true;
    },
    drop: (item, monitor) => {
      if (!containerRef.current) return;

      const clientOffset = monitor.getClientOffset();
      const containerRect = containerRef.current.getBoundingClientRect();

      if (!clientOffset) return;

      const adjustedX = clientOffset.x - containerRect.left;
      const adjustedY = clientOffset.y - containerRect.top;

      let dropIndex: number | null = null;

      const children = Array.from(
        containerRef.current.querySelectorAll(`[class*="${styles.draggableWord}"]`)
      );

      children.forEach((child, index) => {
        const rect = (child as HTMLElement).getBoundingClientRect();
        const childXStart = rect.left - containerRect.left;
        const childXEnd = childXStart + rect.width;
        const childYStart = rect.top - containerRect.top;
        const childYEnd = childYStart + rect.height;

        if (
          adjustedX >= childXStart &&
          adjustedX <= childXEnd &&
          adjustedY >= childYStart &&
          adjustedY <= childYEnd
        ) {
          dropIndex = index;
        }
      });

      if (dropIndex === null) {
        dropIndex = words.length;
      }

      onDrop(item, target, dropIndex);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <Box
      ref={drop}
      className={styles.dropContainer}
      style={{
        backgroundColor: isOver && canDrop ? "#e6f7ff" : undefined,
        transition: "background-color 0.3s ease",
      }}
    >
      <Text className={styles.message}>{message}</Text>
      <Box ref={containerRef} className={styles.wordBox}>
        {words.map((word, index) => (
          <DraggableWord
            key={word.id || `empty-${index}`}
            id={word.id}
            index={index}
            content={word.content || ""}
            source={target}
            className={`${styles.draggableWord} ${movingWord === word.id ? styles.movingWord : ""
              }`}
            onClick={(element) => {
              if (onWordClick) onWordClick(word.id, target, element);
            }}
            animationStyles={movingWord === word.id ? animationStyles : null}
          />
        ))}
      </Box>
    </Box>
  );
};

export default DropContainer;