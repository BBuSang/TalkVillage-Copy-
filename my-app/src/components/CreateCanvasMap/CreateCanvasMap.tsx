import React, { useEffect, useRef } from "react";
import styles from "./CreateCanvasMap.module.css";

// Props 타입 정의
interface ImageCanvasProps {
  imagePath: string; // 이미지 경로
  color?: string | [number, number, number]; // 변경할 색상 (rgb 배열 또는 문자열)
  width?: number;  // 선택적 너비
  height?: number; // 선택적 높이
}

const CreateCanvasMap: React.FC<ImageCanvasProps> = ({ imagePath, color, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const image = new Image();
        image.src = imagePath;
        image.onload = () => {
          // width와 height가 제공되면 해당 크기로, 아니면 이미지 원본 크기로 설정
          canvas.width = width || image.width;
          canvas.height = height || image.height;

          // 이미지를 캔버스 크기에 맞게 그리기
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          // 색상 변경 처리
          if (color) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            let r = 0, g = 0, b = 0;

            if (typeof color === "string") {
              const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
              if (match) {
                r = parseInt(match[1], 10);
                g = parseInt(match[2], 10);
                b = parseInt(match[3], 10);
              }
            } else if (Array.isArray(color)) {
              [r, g, b] = color;
            }

            for (let i = 0; i < data.length; i += 4) {
              if (data[i + 3] > 0) {
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
              }
            }

            context.putImageData(imageData, 0, 0);
          }
        };
      }
    }
  }, [imagePath, color, width, height]);

  const className = `${imagePath.split("/").pop()?.split(".")[0]}Canvas` || "defaultCanvas";

  return (
    <canvas
      ref={canvasRef}
      className={`${styles.MapImageCanvas} ${className}`}
    />
  );
};

export default CreateCanvasMap;
