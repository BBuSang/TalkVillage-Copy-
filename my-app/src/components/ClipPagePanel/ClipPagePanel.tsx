import React, { useEffect, useState, useRef } from 'react';
import { Box, Center, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import NavButtons from './NavigationButtonsPanel';
import StagePanel from '../ClipStagePanel/StagePanel';
import LogoPanel from '../LogoPanel/LogoPanel';
import styles from './ClipPagePanel.module.css';

function ClipPagePanel() {
  const [clips, setClips] = useState<any[]>([]);
  const [sentence, setSentence] = useState<string>(''); // 문장 상태
  const [currentIndex, setCurrentIndex] = useState<number>(0); // 현재 인덱스 상태
  const [isPaused, setIsPaused] = useState<boolean>(false); // 영상 일시정지 여부
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 열림 여부

  const playerRef = useRef<ReactPlayer>(null);
  const navigate = useNavigate();

  // 클립 데이터 fetch
  useEffect(() => {
    const fetchClipData = async () => {
      try {
        const response = await fetch('http://localhost:9999/api/clipCheck', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const clipList = data.clipsData.map((clip: any) => ({
            clipUrl: clip.clipUrl,
            startTime: clip.startTime,
            endTime: clip.endTime,
          }));
          setClips(clipList);
          setSentence(data.sentence); // 받아온 문장 세팅
        }
      } catch (error) {
        console.error('Error fetching clip data:', error);
      }
    };

    fetchClipData();
    
    // 컴포넌트 unmount 시 스타일 복구
    return () => {
      document.documentElement.style.height = '';
    };
  }, []);

  // 다음 클립으로 이동
  const onNext = () => {
    if (currentIndex < clips.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setIsPaused(true); // 마지막 클립일 경우 일시 정지
      setIsModalOpen(true); // 모달 열기
    }
  };

  // 이전 클립으로 이동
  const onPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  // ReactPlayer 준비 완료 후 시작
  const onReady = () => {
    if (playerRef.current && clips.length > 0) {
      playerRef.current.seekTo(clips[currentIndex].startTime || 0);
      setIsPaused(false);
    }
  };

  // 영상 진행 중, 종료 시간에 도달하면 다음 클립으로
  const onProgress = (state: any) => {
    if (state.playedSeconds >= clips[currentIndex]?.endTime) {
      if (currentIndex < clips.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsPaused(true);
        setIsModalOpen(true);
      }
    }
  };

  // 모달에서 "다시보기" 버튼 클릭 시 초기화
  const handleRestart = () => {
    setCurrentIndex(0);
    setIsModalOpen(false);
    setIsPaused(false);
  };

  // 모달에서 "메인화면으로" 버튼 클릭 시
  const handleGoToMain = () => {
    navigate('/');
  };

  return (
    <Box w="100%" h="100vh" bg="#F0F4F8" display="flex" alignItems="center" justifyContent="center"> {/* 부모 Box에 flex 적용 */}
      <Center w="75%" bg="white" m="auto" h="90%" border="2px" borderColor="black" borderRadius="3xl" padding="30px" paddingBottom={'0'}>
        <VStack w="70%" h="100%">
          <Box h="15%" w="100%" border="2px" borderColor="black" borderRadius="3xl" bg="#E3EEF9">
            <Center h="100%" fontSize={'3rem'} fontWeight={'900'}>
              오늘의 문장
            </Center>
          </Box>
          <Box className={styles.clipContainer}> {/* 스타일 적용 */}
            {clips.length > 0 ? (
              <ReactPlayer
                ref={playerRef}
                url={clips[currentIndex].clipUrl}
                controls={false}  // 기본 컨트롤 숨김
                width="100%"
                height="100%"
                playing={!isPaused}
                onReady={onReady}
                onProgress={onProgress}
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,   // 유튜브 제목 숨김
                      rel: 0,              // "나중에 보기" 버튼 숨김
                      showinfo: 0,         // 영상 정보 숨김
                      iv_load_policy: 3,   // 인터랙티브 요소 숨김 (유튜브 로고 포함)
                      fs: 0,               // 전체 화면 버튼 숨김
                      cc_load_policy: 0,   // 자막 버튼 숨김
                      controls: 0,         // 기본 컨트롤 숨김
                    },
                  },
                }}
              />
            ) : (
              <Center h="100%">Loading...</Center>
            )}
          </Box>
          <Box h="20%" bg="#E3EEF9" w="100%" border="2px" borderColor="black" borderRadius="3xl">
            <Center fontSize="2rem" h="100%" fontWeight={'600'}>
              {sentence || 'Loading sentence...'}
            </Center>
          </Box>
          <StagePanel State="someState" currentStep={currentIndex} totalStages={clips.length}/>
        </VStack>
        <NavButtons type="prev" clicked={onPrev} disabled={currentIndex === 0} />
        <NavButtons type="next" clicked={onNext} disabled={currentIndex === clips.length - 1} />
        
        {/* 모달 */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">학습 끝!</ModalHeader>
            <ModalBody textAlign="center">
              모든 영상이 종료되었습니다.
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center" gap="1rem">
              <Button colorScheme="blue" onClick={handleRestart}>
                처음으로
              </Button>
              <Button colorScheme="red" onClick={handleGoToMain}>
                메인으로
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Center>
    </Box>
  );
}

export default ClipPagePanel;
