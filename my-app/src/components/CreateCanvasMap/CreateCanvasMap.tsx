import React, { useEffect, useRef } from "react";
import styles from "./CreateCanvasMap.module.css";

// Props 타입 정의
interface ImageCanvasProps {
  imagePath: string; // 이미지 경로
  color?: string | [number, number, number]; // 변경할 색상 (rgb 배열 또는 문자열)
}

const CreateCanvasMap: React.FC<ImageCanvasProps> = ({ imagePath, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const image = new Image();
        image.src = imagePath; // 외부에서 전달된 경로 사용
        image.onload = () => {
          // 캔버스 크기를 이미지 원본 크기로 설정
          canvas.width = image.width;
          canvas.height = image.height;

          // 이미지 그리기
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          // 색상 변경 처리
          if (color) {
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // 색상 값을 RGB로 변환
            let r = 0,
              g = 0,
              b = 0;

            if (typeof color === "string") {
              // `rgb(r, g, b)` 형식의 문자열을 파싱
              const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
              if (match) {
                r = parseInt(match[1], 10);
                g = parseInt(match[2], 10);
                b = parseInt(match[3], 10);
              }
            } else if (Array.isArray(color)) {
              // 배열로 전달된 경우
              [r, g, b] = color;
            }

            // 픽셀 데이터 수정
            for (let i = 0; i < data.length; i += 4) {
              // 투명도를 유지하면서 색상 변경
              if (data[i + 3] > 0) {
                data[i] = r; // R
                data[i + 1] = g; // G
                data[i + 2] = b; // B
              }
            }

            context.putImageData(imageData, 0, 0);
          }
        };
      }
    }
  }, [imagePath, color]); // imagePath 또는 color가 변경될 때마다 useEffect 실행

  // imagePath에서 파일명을 추출하여 클래스 이름으로 사용
  const className = `${imagePath.split("/").pop()?.split(".")[0]}Canvas` || "defaultCanvas";

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      className={`${styles.MapImageCanvas} ${className}`}
    />
  );
};

export default CreateCanvasMap;
