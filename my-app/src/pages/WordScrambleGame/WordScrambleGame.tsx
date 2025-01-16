import React, { useState, useEffect } from 'react';
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
        } catch (error) {
            console.error("Error fetching scrambled word:", error);
        }
    };

    // 사용자가 입력한 단어와 원래 단어를 비교하는 함수
    const checkAnswer = () => {
        if (userInput.toLowerCase() === originalWord.toLowerCase()) {
            setanswer('정답입니다!')
            setScore(score + 1);
            setCollect(true);
        } else {
            setanswer('다시시도하세요.')
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
    const BackToMain = async () => {
        try {
            // 게임 종료 시 점수 서버로 전송
            const response = await fetch('http://localhost:9999/api/ScrambledWord/givepoint', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ score: score })
            });

            if (!response.ok) {
                throw new Error('점수 저장에 실패했습니다.');
            }
            if(response.status == 200){
                alert(score + '점을 획득했습니다.');
                navigate('/mainmap');
            }
            if(response.status == 205){
                const confirm = window.confirm('로그인정보가 없습니다. 나가시겠습니까?');
                if(confirm){
                    navigate('/mainmap');
                }
                else{
                    alert('이동하지 않습니다.');
                }
            }
        } catch (error) {
            console.error('점수 저장 중 오류:', error);
            alert('점수 저장에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.container}>
                <h1 className={styles.title}>Word Scramble</h1>

                <p className={styles.worddisplay}>
                    <strong>Scrambled Word</strong>
                </p>

                {/* 섞인 단어를 표시 */}
                <div className={styles.scrambledWord}>
                    {scrambledWord.split('').map((char, index) => (
                        <span
                            key={index}
                            style={{
                                fontWeight: 'bold',
                                marginRight: '10px',
                            }}
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
                                fontWeight: 'bold',
                                marginRight: '5px',
                                marginBottom: '10px'
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
                                if(!collect){
                                    checkAnswer();
                                }
                                else if(collect){
                                    NewStage();
                                }
                            }
                        }}
                        placeholder="정답은?"
                    />
                    {/* 정답 여부 */}
                    <span
                        style={{
                            height:'20px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}
                    >
                        {answer}
                    </span>
                    { !collect ? (
                        <button className={styles.button} onClick={checkAnswer}>
                            제출
                        </button>
                    ) : (
                        <button className={styles.button} onClick={NewStage}>
                            다음(Enter)
                        </button>
                    )
                    }
                </div>
                {/* 힌트 보기 버튼 */}
                <div className={styles.hintContainer}>
                    <button className={styles.button} onClick={fetchHint}>
                        힌트 보기
                    </button>
                    <div className={styles.hintDisplay}>
                        <p className={styles.hintText}>{hint}</p>
                    </div>
                </div>
                {/* 스코어 */}
                <p className={styles.score}>
                    <strong>Score:</strong> {score}
                </p>

                {/* 뒤로가기 버튼을 container 안으로 이동 */}
                <button onClick={BackToMain} className={styles.backButton}>
                    메인으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default WordScrambleGame;
