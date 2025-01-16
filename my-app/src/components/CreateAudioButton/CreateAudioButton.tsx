import React, { useState, useRef, useEffect } from "react";
import CreateCanvasMap from "../CreateCanvasMap/CreateCanvasMap";
import SoundOnImage from "../../image/Icons/SoundOn.png";
import SoundOffImage from "../../image/Icons/SoundOff.png";

interface CreateAudioButtonProps {
  audioSrc: string; // 오디오 파일 경로
}

const CreateAudioButton: React.FC<CreateAudioButtonProps> = ({ audioSrc }) => {
  const [isPlaying, setIsPlaying] = useState(false); // 초기 상태: 정지
  const [isInitialized, setIsInitialized] = useState(false); // 화면 클릭으로 초기화 여부
  const audioRef = useRef<HTMLAudioElement>(null); // 오디오 참조

  // 화면 어디를 클릭하든 음악 재생 (초기 한 번만)
  useEffect(() => {
    const handleClick = () => {
      if (!isInitialized && audioRef.current) {
        audioRef.current.play().catch((err) => {
          console.error("오디오 재생 중 오류 발생:", err);
        });
        setIsPlaying(true); // 재생 상태 업데이트
        setIsInitialized(true); // 초기화 완료
      }
    };

    // 클릭 이벤트 등록
    document.addEventListener("click", handleClick);

    return () => {
      // 이벤트 정리
      document.removeEventListener("click", handleClick);
    };
  }, [isInitialized]);

  // Sound Icon 버튼 클릭 핸들러
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation(); // 클릭 이벤트가 상위로 전파되지 않도록 방지
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error("오디오 재생 중 오류 발생:", err);
        });
      }
      setIsPlaying(!isPlaying); // 재생 상태 반전
    }
  };

  return (
    <>
      {/* Sound Icon 버튼 */}
      <div
        className="backgroundSoundButton"
        onClick={toggleAudio}
        style={{
          cursor: "pointer",
        }}
      >
        <CreateCanvasMap
          imagePath={isPlaying ? SoundOffImage : SoundOnImage}
          color="rgb(41, 85, 132)"
        />
      </div>

      {/* 오디오 엘리먼트 */}
      <audio ref={audioRef} src={audioSrc} loop /> {/* 반복 재생 */}
    </>
  );
};

export default CreateAudioButton;
