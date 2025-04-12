import React, { useEffect, useState } from 'react';
import styles from './MyQuests.module.css';
import ProfileComposition from '../ProfileComposition/ProfileComposition';

interface Quest {
    questId: number;
    title: string;
    description: string;
    goal: number;
    exp: number;
    point: number;
    type: string;    // 'DAILY' | 'WEEKLY'
    category: string;
}

interface MyQuest {
    myQuestId: number;
    questList: Quest;
    statement: number | null;
    goal: number;
    completed_at: string | null;
    isRewardClaimed: boolean;
}

const MyQuests: React.FC = () => {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [userQuests, setUserQuests] = useState<MyQuest[]>([]);
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

    const fetchQuests = async () => {
        try {
            const [questsRes, userQuestsRes] = await Promise.all([
                fetch('http://localhost:9999/api/quest/list'),
                fetch('http://localhost:9999/api/quest/myquest', {
                    credentials: 'include'
                })
            ]);

            if (questsRes.ok && userQuestsRes.ok) {
                const questsData = await questsRes.json();
                const userQuestsData = await userQuestsRes.json();
                setQuests(questsData);
                setUserQuests(userQuestsData);
            }
        } catch (error) {
            console.error('Error fetching quests:', error);
        }
    };

    useEffect(() => {
        fetchQuests();
    }, []);

    const renderQuestCard = (quest: Quest) => {
        const userQuest = userQuests.find(uq =>
            uq.questList.questId === quest.questId
        );
        const progress = userQuest?.goal ?? 0;
        const isCompleted = progress >= quest.goal && userQuest?.completed_at !== null;
        const isRewardClaimed = userQuest?.isRewardClaimed ?? false;

        const handleClaimReward = async () => {
            try {
                const response = await fetch(`http://localhost:9999/api/quest/claim`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: quest.title
                    })
                });
                
                if (response.ok) {
                    fetchQuests();
                }
            } catch (error) {
                console.error('보상 수령 중 오류 발생:', error);
                alert('서버 오류가 발생했습니다.');
            }
        };

        return (
            <div key={quest.questId} className={`${styles.questCard} ${isCompleted ? styles.completed : ''}`}>
                <div className={styles.questInfo}>
                    <h3>{quest.title}</h3>
                    <p>{quest.description}</p>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progress}
                            style={{
                                width: `${(progress / quest.goal) * 100}%`,
                                backgroundColor: isCompleted ? '#4CAF50' : '#007bff'
                            }}
                        />
                    </div>
                    <div className={styles.progressText}>
                        <span>{progress} / {quest.goal}</span>
                        {isCompleted && <span className={styles.completedText}>완료!</span>}
                    </div>
                    <span className={styles.points}>{quest.exp} EXP {quest.point} Toks</span>
                    {isCompleted && (
                        <>
                            <ClearStamp />
                            {isRewardClaimed ? (
                                <span className={styles.rewardClaimed}>지급 완료</span>
                            ) : (
                                <button 
                                    onClick={handleClaimReward}
                                    className={styles.claimButton}
                                >
                                    보상 받기
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    const dailyQuests = quests.filter(quest => quest.type === 'DAILY');
    const weeklyQuests = quests.filter(quest => quest.type === 'WEEKLY');

    return (
        <div className={styles.outsidecontainer}>
            <div className={styles.questContainer}>
                <div className={styles.leftSideContainer}>
                    <div className={styles.leftPanel}>
                        <h1 className={styles.title}>퀘스트</h1>
                        <div className={styles.profile}>
                            <ProfileComposition />
                        </div>
                    </div>
                </div>
                <div className={styles.centerPanel}>
                    <div className={styles.recentcenterPanel}>
                        <div className={styles.questSection}>
                            <div className={styles.tabContainer}>
                                <button 
                                    className={`${styles.tabButton} ${activeTab === 'daily' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('daily')}
                                >
                                    일일 퀘스트
                                </button>
                                <button 
                                    className={`${styles.tabButton} ${activeTab === 'weekly' ? styles.activeTab : ''}`}
                                    onClick={() => setActiveTab('weekly')}
                                >
                                    주간 퀘스트
                                </button>
                            </div>
                            
                            {activeTab === 'daily' && (
                                <div className={styles.questGrid}>
                                    {dailyQuests.map(quest => renderQuestCard(quest))}
                                </div>
                            )}
                            
                            {activeTab === 'weekly' && (
                                <div className={styles.questGrid}>
                                    {weeklyQuests.map(quest => renderQuestCard(quest))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <h3 className={styles.recentTitle}>최근 완료</h3>
                    <div className={styles.recentQuests}>
                        {userQuests.filter((mq): mq is MyQuest & { completed_at: string } => mq.completed_at !== null).length === 0 ? (
                            <div className={styles.noQuests}>
                                최근 완료한 퀘스트가 없습니다.
                            </div>
                        ) : (
                            userQuests
                                .filter((mq): mq is MyQuest & { completed_at: string } => mq.completed_at !== null)
                                .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                                .map(mq => (
                                    <div key={mq.myQuestId} className={styles.recentItem}>
                                        <div className={styles.recentInfo}>
                                            <span>{mq.questList.title}</span>
                                            <span className={styles.date}>
                                                {new Date(mq.completed_at).toLocaleString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClearStamp = () => (
    <div className={styles.clearStamp}>
        <svg viewBox="0 0 160 70">
            <defs>
                <filter id="roughpaper">
                    <feTurbulence type="fractalNoise" baseFrequency="0.04"
                        numOctaves="5" result="noise" />
                    <feDiffuseLighting in="noise" lightingColor="#fff"
                        surfaceScale="2" result="diffLight">
                        <feDistantLight azimuth="45" elevation="60" />
                    </feDiffuseLighting>
                    <feComposite in="SourceGraphic" in2="diffLight"
                        operator="in" result="composite" />
                </filter>
            </defs>
            <rect className={styles.stampBorder}
                x="5" y="5" width="150" height="60" />
            <text className={styles.stampText}
                x="50%" y="50%"
                dominantBaseline="middle"
                textAnchor="middle">
                CLEAR
            </text>
        </svg>
    </div>
);

export default MyQuests; 