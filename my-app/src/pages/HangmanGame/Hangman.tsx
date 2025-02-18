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
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    if (showGame) {
      startNewGame();
    }
  }, [showGame]);

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
        setGameStatus(`이번 단어는 "${word}" 였습니다.`);
        setGameOver(true);
      }
    } catch (error) {
      console.error('Error making a guess:', error);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const letter = event.key.toLowerCase();
      if (/^[a-z]$/.test(letter)) {
        guessLetter(letter);
      } else if (event.code === "Space" && gameOver) {
        startNewGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [clickedLetters, gameOver, guessLetter]);

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

  const GivePtandExp = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/hangman/givepoint', {
        method: 'GET',
        credentials: 'include',
      });
      // 1exp, 10point
      console.log(response.status);
      if (response.status == 205) {
        console.log('로그인 되지 않음');
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
    setIsZooming(true);  // 줌 효과 시작
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:9999/api/hangman/start-game');
        if (!response.ok) throw new Error('Failed to start a new game');
        setShowGame(true);
      } catch (error) {
        console.error('Error starting game:', error);
      }
    }, 800);  // 줌 애니메이션이 끝나갈 때 게임 시작
  };
  const backToMain = () => {
    navigate('/mainmap');
  };

  return (
    <div className={styles.gameContainerOutside}>

      <div className={gameOver ? styles.gameOverBoxoutside : styles.outside}>
        <div className={gameOver ? styles.gameOverBox : styles.disnewbutton}>
          <div className={gameOver ? styles.gameOver : styles.gameStatus}>Game Over</div>
          <div className={gameOver ? styles.gameOverword : styles.gameStatus}>{gameStatus}</div>
          <div className={styles.gameOveragain}>PLAY AGAIN ?</div>
          <div className={styles.gameOveragainbutton}>
            <button onClick={startNewGame} className={styles.newbutton}>Yes</button>
            <button onClick={backToMain} className={styles.newbutton}>No</button>
          </div>
          <div className={styles.regamemessage}>SpaceBar를 눌러 다시하기</div>
        </div>
      </div>

      <div className={styles.gameContainer}>
        {!showGame ? (
          <div className={styles.startContainer}>
            <div className={`${styles.hangmantitle1} ${isZooming ? styles.zoomEffect : ''}`}>
              HangMan
            </div>
            <button 
              onClick={StartGame} 
              className={`${styles.startButton} ${isZooming ? styles.hideButton : ''}`}
            >
              Start Game
            </button>
          </div>
        ) : (
          <>
            <div className={styles.leftSection}>
              <HangmanDrawing remainingAttempts={remainingAttempts} />
              <div className={styles.remainingBox}>
                <div className={styles.remainingText}>남은 기회</div>
                <div className={styles.remainingTries}>{remainingAttempts}</div>
              </div>
            </div>

            <div className={styles.rightSection}>
              <div className={styles.categoryBox}>
                <p className={styles.categoryText}>카테고리 : {category}</p>
              </div>

              <div className={styles.displayBox}>
                <p className={styles.displayWord}>
                  {displayWord.split('').map((char, index) => (
                    <span key={index}>{char} </span>
                  ))}
                </p>
              </div>


              <div className={styles.wordbox}>
                {alphabetRows.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.buttonRow}>
                    {row.split('').map((letter) => (
                      <button
                        key={letter}
                        onClick={() => guessLetter(letter)}
                        disabled={gameOver || clickedLetters.includes(letter)}
                        className={`${styles.button} ${displayWord.includes(letter)
                          ? styles.usedLetter
                          : clickedLetters.includes(letter)
                            ? styles.clickedLetter
                            : ''
                          }`}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default HangmanGame;
