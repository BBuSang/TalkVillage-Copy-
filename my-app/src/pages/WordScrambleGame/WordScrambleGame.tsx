import React, { useState, useEffect, useRef } from 'react';
import styles from './WordScrambleGame.module.css';
import { useNavigate } from 'react-router-dom';

function WordScrambleGame() {
    const [scrambledWord, setScrambledWord] = useState('');
    const [originalWord, setOriginalWord] = useState('');
    const [userInput, setUserInput] = useState('');
    const [hint, setHint] = useState('');
    const [score, setScore] = useState(0);
    const [answer, setanswer] = useState('');
    const [collect, setCollect] = useState(false);
    const [ishint, setIshint] = useState(false);
    const [showGame, setShowGame] = useState(false);
    const [isExploding, setIsExploding] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // 게임이 처음 시작할 때 단어를 가져오는 함수
    useEffect(() => {
        fetchNewWord();
    }, []);

    // 새로운 섞인 단어를 가져오는 함수
    const fetchNewWord = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/ScrambledWord/scrambled');
            const data = await response.json();
            setScrambledWord(data.scrambled);  // 섞인 단어
            setOriginalWord(data.word);        // 원래 단어
            setHint('');                        // 힌트 초기화
            setUserInput('');                   // 입력 초기화
            setanswer('');                      // 정답 여부 초기화
            setCollect(false);                  // 제출 후 버튼 초기화
            setIshint(false);
        } catch (error) {
            console.error("Error fetching scrambled word:", error);
        }
    };

    // 사용자가 입력한 단어와 원래 단어를 비교하는 함수
    const checkAnswer = async () => {
        if (userInput.toLowerCase() === originalWord.toLowerCase()) {
            try {
                // 단어 길이만큼 점수 즉시 지급
                const response = await fetch('http://localhost:9999/api/ScrambledWord/givepoint', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ score: originalWord.length })
                });

                if (!response.ok) {
                    throw new Error('점수 저장에 실패했습니다.');
                }

                if (response.status === 200) {
                    if (ishint) {
                        setanswer(`정답입니다! ${originalWord.length / 2}점을 획득했습니다!`);
                        setCollect(true);
                    }
                    else {
                        setanswer(`정답입니다! ${originalWord.length}점을 획득했습니다!`);
                        setCollect(true);
                    }

                } else if (response.status === 205) {
                    setanswer('정답입니다! (No Login)');
                    setCollect(true);
                }
            } catch (error) {
                console.error('점수 저장 중 오류:', error);
                setanswer('정답입니다! (점수 저장 실패)');
                setCollect(true);
            }
        } else {
            setanswer('다시 시도하세요.');
        }
    };
    const NewStage = () => {
        fetchNewWord();
    }

    // 힌트를 가져오는 함수
    const fetchHint = async () => {
        try {
            const response = await fetch(`http://localhost:9999/api/ScrambledWord/hint?word=${originalWord}`);
            const data = await response.text();
            setHint(data);  // 힌트 문자열 설정
            setIshint(true);
        } catch (error) {
            console.error("Error fetching hint:", error);
        }
    };

    // 글자의 색상을 처리하는 함수
    const getLetterColor = (inputLetter: string, index: number) => {
        // 원래 단어에서 해당 위치의 문자와 입력한 문자가 맞는지 확인
        const correctChar = originalWord[index]?.toLowerCase();
        const inputChar = inputLetter?.toLowerCase();

        if (inputChar === correctChar) {
            return 'green';  // 맞으면 초록색
        } else if (inputLetter !== '') {
            return 'red';  // 틀리면 빨간색
        } else {
            return 'black';  // 아직 입력 안 된 글자는 검은색
        }
    };

    const createPixels = () => {
        const container = containerRef.current;
        if (!container) return;
        
        const pixels = [];
        const rect = container.getBoundingClientRect();
        const numPixels = 50; // 폭발 파편 수

        for (let i = 0; i < numPixels; i++) {
            const pixel = document.createElement('div');
            pixel.className = styles.pixel;
            
            // 랜덤한 시작 위치 (컨테이너 중앙)
            const startX = rect.width / 2;
            const startY = rect.height / 2;
            
            // 랜덤한 이동 방향과 거리
            const angle = (Math.random() * 360) * (Math.PI / 180);
            const distance = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            pixel.style.setProperty('--tx', `${tx}px`);
            pixel.style.setProperty('--ty', `${ty}px`);
            pixel.style.setProperty('--rot', `${Math.random() * 360}deg`);
            pixel.style.left = `${startX}px`;
            pixel.style.top = `${startY}px`;
            
            pixels.push(pixel);
            container.appendChild(pixel);
        }
        
        return pixels;
    };

    const StartGame = () => {
        setIsExploding(true);
        const pixels = createPixels();
        
        // 약간의 지연 후 폭발 시작
        setTimeout(() => {
            containerRef.current?.classList.add(styles.explode);
            
            // 폭발 애니메이션 후 게임 시작
            setTimeout(() => {
                setShowGame(true);
                // 파편 제거
                pixels?.forEach(pixel => pixel.remove());
            }, 800);
        }, 100);
    };

    return (
        <div className={styles.outsidecontainer}>
            <div className={styles.body}>
                {!showGame ? (
                    <div 
                        ref={containerRef} 
                        className={styles.startContainer}
                    >
                        <div className={styles.gameTitle}>WORD SCRAMBLE</div>
                        <button 
                            onClick={StartGame} 
                            className={styles.startButton}
                            style={{ opacity: isExploding ? 0 : 1 }}
                        >
                            START GAME
                        </button>
                    </div>
                ) : (
                    <div className={styles.container}>
                        {/* 섞인 단어를 표시 */}
                        <div className={styles.scrambledWord}>
                            {scrambledWord.split('').map((char, index) => (
                                <span
                                    key={index}
                                >
                                    {char}
                                </span>
                            ))}
                        </div>
                        {/* 입력된 글자 밑에 색상으로 구분하여 표시 */}
                        <div className={styles.inputDisplay}>
                            {userInput.split('').map((letter, index) => (
                                <span
                                    key={index}
                                    style={{
                                        color: getLetterColor(letter, index),
                                    }}
                                >
                                    {letter}
                                </span>
                            ))}
                        </div>
                        {/* 입력창 */}
                        <div className={styles.inputContainer}>
                            <input
                                type="text"
                                className={styles.inputfield}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (!collect) {
                                            checkAnswer();
                                        }
                                        else if (collect) {
                                            NewStage();
                                        }
                                    }
                                }}
                                maxLength={originalWord.length}
                                placeholder="정답은?"
                            />
                            {/* 정답 여부 */}
                            <span className={styles.answer} >{answer} </span>
                            {!collect ? (
                                <>
                                    <button className={styles.button} onClick={checkAnswer}>
                                        ENTER!
                                    </button>
                                    <span className={styles.buttonedu}></span>
                                </>
                            ) : (<>
                                <button className={styles.button} onClick={NewStage}>
                                    NEXT!
                                </button>
                                <span className={styles.buttonedu}>Enter를 눌러 다음 문제로 넘어가세요!</span>
                            </>
                            )
                            }
                        </div>
                        {/* 힌트 보기 버튼 */}
                        {!ishint ?
                            <div className={styles.hintContainer}>
                                <button className={styles.button} onClick={fetchHint}>
                                    HINT!
                                </button>
                            </div>
                            :
                            <div className={styles.hintDisplay}>
                                <p className={styles.hintText}>{hint}</p>
                            </div>
                        }
                    </div>
                )}
            </div>
        </div>
    );
}

export default WordScrambleGame;
