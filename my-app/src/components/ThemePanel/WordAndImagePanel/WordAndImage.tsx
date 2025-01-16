import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './WordAndImage.module.css'; // 자동 생성된 .module.css 파일을 import

interface ImageData {
  prompt: string;
  imageUrl: string;
  result: string;
}

const WordAndImage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const themeId = 'your_theme_id'; // 사용하려는 themeId 값으로 설정

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/image-display/storedImages', {
          params: { themeId },
        });
        if (response.status === 200 && Array.isArray(response.data)) {
          setImages(response.data);
          setError(null);
        } else {
          setError("저장된 이미지를 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("이미지 로드 오류:", err);
        setError("이미지 로드 오류가 발생했습니다.");
      }
    };

    fetchImages();
  }, [themeId]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>저장된 이미지 보기</h1>
      {error && <p className={styles.errorText}>{error}</p>}
      <div className={styles.imageGrid}>
        {images.map((image, index) => (
          <div key={index} className={styles.imageBox}>
            <p className={styles.imagePrompt}>{image.prompt}</p>
            <img
              src={`http://localhost:9999${image.imageUrl}`}
              alt={image.prompt}
              className={styles.image}
            />
            <p className={styles.imageResult}>Result: {image.result}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordAndImage;
