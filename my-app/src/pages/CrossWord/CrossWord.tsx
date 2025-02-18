import React, { useState, useEffect } from 'react';
import styles from './CrossWord.module.css';
import { useNavigate } from 'react-router-dom';

interface WordPosition {
  word: string;
  description: string;
  startRow: number;
  startCol: number;
  direction: string;
  number: number;
  length: number;
}

function CrossWord() {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<string[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [displayGrid, setDisplayGrid] = useState<string[][]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [showGame, setShowGame] = useState(false);
  const [isCurtainDown, setIsCurtainDown] = useState(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (showGame && !showSuccess) {  // 게임이 시작되고 성공하지 않았을 때만
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    // cleanup 함수
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [showGame, showSuccess]);  // showGame과 showSuccess가 변경될 때만 실행

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch('http://localhost:9999/api/puzzle/generate');
        const data = await response.json();
        setGrid(data.grid);
        setWordPositions(data.wordPositions);

        const initial = data.grid.map((row: string[]) => [...row].map(() => ''));
        data.wordPositions.forEach((pos: WordPosition) => {
          if (pos.direction === 'HORIZONTAL') {
            for (let i = 0; i < pos.length; i++) {
              initial[pos.startRow][pos.startCol + i] = i === 0 ? String(pos.number) : '';
            }
          } else {
            for (let i = 0; i < pos.length; i++) {
              initial[pos.startRow + i][pos.startCol] = i === 0 ? String(pos.number) : '';
            }
          }
        });
        setDisplayGrid(initial);

        const initialAnswers: { [key: number]: string } = {};
        data.wordPositions.forEach((pos: WordPosition) => {
          initialAnswers[pos.number] = '';
        });
        setUserAnswers(initialAnswers);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error fetching puzzle:', error);
      }
    };

    fetchPuzzle();
  }, []);

  const handleAnswerChange = (number: number, value: string) => {
    const newAnswers = {
      ...userAnswers,
      [number]: value.toLowerCase()
    };
    setUserAnswers(newAnswers);

    const position = wordPositions.find(pos => pos.number === number);
    if (!position) return;

    if (value.length === position.word.length) {
      const isCorrect = value.toLowerCase() === position.word.toLowerCase();
      if (isCorrect) {
        const newDisplayGrid = displayGrid.map(row => [...row]);
        if (position.direction === 'HORIZONTAL') {
          for (let i = 0; i < value.length; i++) {
            newDisplayGrid[position.startRow][position.startCol + i] = grid[position.startRow][position.startCol + i];
          }
        } else {
          for (let i = 0; i < value.length; i++) {
            newDisplayGrid[position.startRow + i][position.startCol] = grid[position.startRow + i][position.startCol];
          }
        }
        setDisplayGrid(newDisplayGrid);
      }
    }

    if (Object.keys(newAnswers).length === wordPositions.length &&
      wordPositions.every(pos =>
        newAnswers[pos.number]?.toLowerCase() === pos.word.toLowerCase()
      )) {
      setShowSuccess(true);
      submitScore();
    }
  };

  const submitScore = async () => {
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    try {
      const response = await fetch('http://localhost:9999/api/puzzle/score', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(elapsedTime)
      });
      if (response.status === 205) {
        console.log("로그인 되지 않음");
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const handleRetry = async () => {
    setShowSuccess(false);
    setUserAnswers({});
    try {
      const response = await fetch('http://localhost:9999/api/puzzle/generate');
      const data = await response.json();
      setGrid(data.grid);
      setWordPositions(data.wordPositions);
      const initial = data.grid.map((row: string[]) => [...row].map(() => ''));
      data.wordPositions.forEach((pos: WordPosition) => {
        if (pos.direction === 'HORIZONTAL') {
          for (let i = 0; i < pos.length; i++) {
            initial[pos.startRow][pos.startCol + i] = i === 0 ? String(pos.number) : '';
          }
        } else {
          for (let i = 0; i < pos.length; i++) {
            initial[pos.startRow + i][pos.startCol] = i === 0 ? String(pos.number) : '';
          }
        }
      });
      setDisplayGrid(initial);
      setStartTime(Date.now());
    } catch (error) {
      console.error('Error fetching puzzle:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formattedElapsedTime = formatTime(elapsedTime);

  const backtomain = () => {
    navigate('/mainmap');
  };

  const StartGame = () => {
    setIsCurtainDown(true);  // 커튼 내리기
    setTimeout(() => {
      setShowGame(true);  // 게임 화면으로 전환
      setTimeout(() => {
        setIsCurtainDown(false);  // 커튼 올리기
      }, 100);
    }, 800);
  };

  return (
    <div className={styles.outsidecontainer}>
      <div className={styles.pageContainer}>
        <div className={`${styles.curtain} ${isCurtainDown ? styles.down : ''}`} />
        {!showGame ? (
          <div className={styles.startbackground}>
            <div className={styles.startContainer}>
              <div className={styles.gameTitle}>CROSSWORD</div>
              <button onClick={StartGame} className={styles.startButton}>
                START GAME
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.gameContainer}>
            <div className={styles.gridContainer}>
              <div className={styles.grid}>
                {displayGrid.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.gridRow}>
                    {row.map((cell, colIndex) => {
                      const isPartOfWord = wordPositions.some(pos => {
                        if (pos.direction === 'HORIZONTAL') {
                          return rowIndex === pos.startRow &&
                            colIndex >= pos.startCol &&
                            colIndex < pos.startCol + pos.length;
                        } else {
                          return colIndex === pos.startCol &&
                            rowIndex >= pos.startRow &&
                            rowIndex < pos.startRow + pos.length;
                        }
                      });

                      const wordNumbers = wordPositions
                        .filter(pos =>
                          (pos.direction === 'HORIZONTAL' && rowIndex === pos.startRow && colIndex === pos.startCol) ||
                          (pos.direction === 'VERTICAL' && rowIndex === pos.startRow && colIndex === pos.startCol)
                        )
                        .map(pos => ({
                          number: pos.number,
                          direction: pos.direction
                        }));

                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`${styles.gridCell} ${cell === '' && !isPartOfWord ? styles.emptyCell :
                            isPartOfWord ? styles.letterCell :
                              styles.filledCell
                            }`}
                        >
                          {wordNumbers.length > 0 && (
                            <>
                              {wordNumbers.map((word, index) => (
                                <span
                                  key={word.number}
                                  className={`${styles.cellNumber} ${wordNumbers.length > 1 && index === 1 ? styles.right : ''
                                    }`}
                                >
                                  {word.number}
                                </span>
                              ))}
                            </>
                          )}
                          {cell.match(/[a-z]/i) ? cell : ''}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.sidePanel}>
              <div className={styles.headerContainer}>
                <h2 className={styles.sidePanelTitle}>WORD LIST</h2>
                <div className={styles.timerBox}>
                  <div className={styles.timer}>{formattedElapsedTime}</div>
                </div>
              </div>
              <div className={styles.wordListWrapper}>
                {wordPositions.map((position) => (
                  <div key={position.number} className={styles.wordListItem}>
                    <span className={styles.wordNumber}>{position.number}.</span>
                    <span className={styles.wordDescription}>
                      {position.description}
                    </span>
                    <div className={styles.answerInput}>
                      <input
                        type="text"
                        value={userAnswers[position.number] || ''}
                        onChange={(e) => handleAnswerChange(position.number, e.target.value)}
                        maxLength={position.length}
                        className={`${styles.input} ${userAnswers[position.number] &&
                          userAnswers[position.number].length === position.word.length &&
                          (userAnswers[position.number].toLowerCase() === position.word.toLowerCase()
                            ? styles.correctAnswer
                            : styles.wrongAnswer)
                          }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {showSuccess && (
        <div className={styles.successOverlay}>
          <div className={styles.successMessage}>
            <h2 className={styles.successTitle}>CLEARED</h2>
            <p className={styles.successTime}>TIME : {formattedElapsedTime}</p>
            <div className={styles.isretry}> Try Again ?</div>
            <div className={styles.retryButtons}>
              <button onClick={handleRetry} className={styles.retryButton}>Yes</button>
              <button onClick={backtomain} className={styles.retryButton}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CrossWord;
