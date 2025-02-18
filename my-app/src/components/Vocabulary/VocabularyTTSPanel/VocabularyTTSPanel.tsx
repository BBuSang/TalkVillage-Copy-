// components/Vocabulary/VocabularyTTSPanel/VocabularyTTSPanel.tsx
import React, { useState } from 'react';
import {
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { FaVolumeUp } from 'react-icons/fa';

interface VocabularyTTSPanelProps {
  text: string;
  style?: React.CSSProperties;
  [key: string]: any;  // Chakra UI의 스타일 props를 위한 인덱스 시그니처
}

const VocabularyTTSPanel: React.FC<VocabularyTTSPanelProps> = ({
  text,
  style,
  ...props
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const toast = useToast();

  const handleTextToSpeech = async () => {
    if (isPlaying) return;

    try {
      setIsPlaying(true);

      const response = await fetch('http://localhost:9999/api/tts/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('발음 재생에 실패했습니다.');
      }

      const data = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "발음 재생 실패",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      };

      await audio.play();

    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "발음 재생 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <IconButton
      aria-label="단어 발음 듣기"
      icon={<FaVolumeUp />}
      size="sm"
      isLoading={isPlaying}
      onClick={handleTextToSpeech}
      variant="ghost"
      colorScheme="blue"
      style={style}
      {...props}
    />
  );
};

export default VocabularyTTSPanel;