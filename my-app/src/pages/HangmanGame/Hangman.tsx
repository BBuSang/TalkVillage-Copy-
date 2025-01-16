import React, { useState, useEffect } from 'react';
import HangmanDrawing from '../../components/HangmanDrawing/HangmanDrawing';
import styles from './Hangman.module.css';
import { space } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

function HangmanGame() {
  const [showGame, setShowGame] = useState(false);
  const [displayWord, setDisplayWord] = useState('');
  const [word, setWord] = useState('');
  const [remainingAttempts, setRemainingAttempts] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('');
  const [clickedLetters, setClickedLetters] = useState<string[]>([]);
  const [category, setCategory] = useState(''); // 카테고리 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    if (showGame) {
      startNewGame();
    }
  }, [showGame]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const letter = event.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) {
        guessLetter(letter);
      } else if (event.code === "Space" && gameOver) {
        startNewGame();
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [clickedLetters, gameOver]);

  const startNewGame = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/hangman/new-game');
      if (!response.ok) throw new Error('Failed to start a new game');
      const data = await response.json();
      setDisplayWord('_'.repeat(data.wordToGuess.length).trim());
      setWord(data.wordToGuess);
      setRemainingAttempts(data.remainingAttempts);
      setCategory(data.category); // 서버에서 받은 카테고리 값 설정
      setGameOver(false);
      setGameStatus('');
      setClickedLetters([]);
    } catch (error) {
      console.error('Error starting new game:', error);
    }
  };

  const guessLetter = async (letter: string) => {
    if (clickedLetters.includes(letter) || gameOver) return;

    try {
      const response = await fetch('http://localhost:9999/api/hangman/guess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ letter }),
      });

      if (!response.ok) throw new Error('Failed to make a guess');

      const data = await response.json();
      setDisplayWord(data.displayWord);
      setRemainingAttempts(data.remainingAttempts);
      setClickedLetters((prevClickedLetters) => [...prevClickedLetters, letter]);

      if (data.gameWon) {
        setGameStatus('축하합니다! 정답입니다!');
        setGameOver(true);
        GivePtandExp();
      } else if (data.gameLost) {
        setGameStatus(`Game Over. 이번 단어는 "${word}" 였습니다.`);
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error making a guess:', error);
    }
  };

  const GivePtandExp = async () =>{
    try {
      const response = await fetch('http://localhost:9999/api/hangman/givepoint', {
        method: 'GET',
        credentials: 'include',
    });
    // 1exp, 10point
    if(response.status == 205){
      // 비 로그인
    }
    } catch (error) {
      console.error('보상 입력 오류', error)
    }
  };


  const alphabetRows = [
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
  ];

  const StartGame = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/hangman/start-game');
      if (!response.ok) throw new Error('Failed to start a new game');
      setShowGame(true);
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const BackToMain = () => {
    navigate('/mainmap');
  };

  return (
    <div className={styles.gameContainer}>
      {!showGame ? (
        <div className={styles.startContainer} >
          <div className={styles.hangmantitle1} >Hangman</div>
          <button onClick={StartGame} className={styles.startButton}>
            게임 시작
          </button>
          <button onClick={BackToMain} className={styles.backButton}>
            메인으로 돌아가기
          </button>
        </div>
      ) : (
        <>
          <div className={styles.hangmantitle2}>Hangman Game</div>

          {/* 그림 그려지는 곳 */}
          <HangmanDrawing remainingAttempts={remainingAttempts} />

          {/* 카테고리 표시 */}
          <div className={styles.categoryBox}>
            <p className={styles.categoryText}>카테고리 : {category}</p>
          </div>

          <div className={styles.remainingBox}>
            <div className={styles.remainingText}>남은 기회</div>
            <div className={styles.remainingTries}>{remainingAttempts}</div>
          </div>
          <div className={styles.displayBox}>
            <p className={styles.displayWord}>
              {displayWord.split('').map((char, index) => (
                <span key={index}>{char} </span>
              ))}
            </p>
          </div>
          {/* 게임 오버 메세지 나오는 칸 */}
          <div className={gameOver ? styles.gameOverBox : styles.disnewbutton}>
            <div className={gameOver ? styles.gameOver : styles.gameStatus}>{gameStatus}</div>
            <button onClick={startNewGame} className={styles.newbutton}>다시하기</button>
            <div className={styles.regamemessage}>Space바를 눌러 다시하기</div>
          </div>
          {/* 키보드 */}
          <div className={styles.wordbox}>
            {alphabetRows.map((row, rowIndex) => (
              <div key={rowIndex} className={styles.buttonRow}>
                {row.split('').map((letter) => (
                  <button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={gameOver || clickedLetters.includes(letter)}
                    className={`${styles.button} ${displayWord.includes(letter) ? styles.usedLetter :
                      clickedLetters.includes(letter) ? styles.clickedLetter : ''
                      }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ))}
          </div>
            <button onClick={BackToMain} className={styles.backButton}>메인으로 돌아가기</button>
        </>
      )}
    </div>
  );
}

export default HangmanGame;
