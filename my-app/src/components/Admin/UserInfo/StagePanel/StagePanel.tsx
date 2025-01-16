import React, { useState, useEffect } from 'react';
import styles from './StagePanel.module.css';

interface StagePanelProps {
  userId?: number;
}

interface MyStage {
  myStageId: number;
  user: {
    userId: number;
    email: string;
  };
  easy: string;
  normal: string;
  hard: string;
}

type Difficulty = 'easy' | 'normal' | 'hard';

const difficulties: Difficulty[] = ['easy', 'normal', 'hard'];

const StagePanel: React.FC<StagePanelProps> = ({ userId }) => {
  const [stageInfo, setStageInfo] = useState<MyStage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStageInfo = async () => {
    if (userId === undefined) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9999/api/user/userstage?userId=${userId}`);
      
      if (response.status === 201) {
        setStageInfo(null);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStageInfo(data);
      
    } catch (err) {
      console.error('Error fetching stage info:', err);
      setError('스테이지 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStageInfo();
  }, [userId]);

  const handleStageUpdate = async (difficulty: Difficulty, chapter: number, stage: number) => {
    if (!userId && userId !== 0) return;
    
    try {
      const response = await fetch(`http://localhost:9999/api/user/userstage/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          [difficulty]: `${chapter}-${stage}`
        })
      });

      if (!response.ok) throw new Error('스테이지 정보 업데이트에 실패했습니다.');
      
      fetchStageInfo();
    } catch (err) {
      console.error('Error updating stage:', err);
      setError('스테이지 정보 업데이트에 실패했습니다.');
    }
  };

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (userId === undefined) return <div className={styles.error}>사용자를 선택해주세요.</div>;

  const defaultStageInfo: MyStage = {
    myStageId: 0,
    user: {
      userId: userId,
      email: ''
    },
    easy: '1-1',
    normal: '1-1',
    hard: '1-1'
  };

  const currentStageInfo = stageInfo || defaultStageInfo;

  return (
    <div className={styles.stagePanel}>
      <h2>스테이지 진행 현황</h2>
      <div className={styles.stageGrid}>
        {difficulties.map((difficulty) => {
          const value = currentStageInfo[difficulty] || '1-1';
          const [chapter, stage] = value.split('-').map(Number);
          return (
            <div key={difficulty} className={styles.stageItem}>
              <h3>{difficulty.toUpperCase()}</h3>
              <div className={styles.stageStatus}>
                <div className={styles.stageInput}>
                  <label>챕터:</label>
                  <select
                    value={chapter}
                    onChange={(e) => handleStageUpdate(
                      difficulty,
                      parseInt(e.target.value),
                      stage
                    )}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.stageInput}>
                  <label>스테이지:</label>
                  <select
                    value={stage}
                    onChange={(e) => handleStageUpdate(
                      difficulty,
                      chapter,
                      parseInt(e.target.value)
                    )}
                  >
                    {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StagePanel; 