// TextToSpeechPanel.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  useToast,
  Icon
} from "@chakra-ui/react";
import { FaVolumeUp } from 'react-icons/fa';

interface TextToSpeechPanelProps {
  text: string;
  isAnswerSelected: boolean;
  style?: React.CSSProperties;
}

const TextToSpeechPanel: React.FC<TextToSpeechPanelProps> = ({
  text,
  isAnswerSelected,
  style
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
        throw new Error('TTS 변환에 실패했습니다.');
      }

      const data = await response.json();
      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "오디오 재생 실패",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      };

      await audio.play();

    } catch (error) {
      setIsPlaying(false);
      toast({
        title: "TTS 변환 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="inline-block" style={style}>
      <Button
        onClick={handleTextToSpeech}
        isLoading={isPlaying}
        leftIcon={<Icon as={FaVolumeUp} />}
        colorScheme="blue"
        size="sm"
        variant="ghost"
        aria-label="텍스트 읽기"
        isDisabled={!isAnswerSelected}
      >
        듣기
      </Button>
    </Box>
  );
};

export default TextToSpeechPanel;