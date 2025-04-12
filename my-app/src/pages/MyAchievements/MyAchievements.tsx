import React, { useEffect, useState } from 'react';
import styles from './MyAchievements.module.css';
import ProfileComposition from '../ProfileComposition/ProfileComposition';

interface Achievement {
    achievementId: number;
    title: string;
    content: string;
    goal: number;
    exp: number;
    type: string;
    category: string;
}

interface MyAchievement {
    myAchievementId: number;
    achievementsList: Achievement;
    statement: number | null;
    goal: number;
    achieved_at: string | null;
    isRewardClaimed: boolean;
}

const MyAchievements: React.FC = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<MyAchievement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("전체");

    const fetchAchievements = async () => {
        try {
            const [achievementsRes, userAchievementsRes] = await Promise.all([
                fetch('http://localhost:9999/api/achievement/list'),
                fetch('http://localhost:9999/api/achievement/myachieve', {
                    credentials: 'include'
                })
            ]);

            if (achievementsRes.ok && userAchievementsRes.ok) {
                const achievementsData = await achievementsRes.json();
                const userAchievementsData = await userAchievementsRes.json();
                setAchievements(achievementsData);
                setUserAchievements(userAchievementsData);
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
        }
    };

    useEffect(() => {
        fetchAchievements();
    }, []);

    const groupedAchievements = achievements.reduce((acc, achievement) => {
        const category = achievement.category || "기타";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(achievement);
        return acc;
    }, {} as Record<string, Achievement[]>);

    const renderAchievementCard = (achievement: Achievement) => {
        const userAchievement = userAchievements.find(ua =>
            ua.achievementsList.achievementId === achievement.achievementId
        );
        const progress = userAchievement?.goal ?? 0;
        const isCompleted = progress >= achievement.goal && userAchievement?.achieved_at !== null;
        const isRewardClaimed = userAchievement?.isRewardClaimed ?? false;

        const handleClaimReward = async () => {
            try {
                const response = await fetch(`http://localhost:9999/api/achievement/claim`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: achievement.title
                    })
                });
                
                const text = await response.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    data = { message: text };
                }
                
                if (response.ok) {
                    fetchAchievements();
                } else {
                }
            } catch (error) {
                console.error('보상 수령 중 오류 발생:', error);
                alert('서버 오류가 발생했습니다.');
            }
        };

        return (
            <div key={achievement.achievementId} className={`${styles.achievementCard} ${isCompleted ? styles.completed : ''}`}>
                <div className={styles.achievementInfo}>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.content}</p>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progress}
                            style={{
                                width: `${(progress / achievement.goal) * 100}%`,
                                backgroundColor: isCompleted ? '#4CAF50' : '#007bff'
                            }}
                        />
                    </div>
                    <div className={styles.progressText}>
                        <span>{progress} / {achievement.goal}</span>
                        {isCompleted && <span className={styles.completedText}>완료!</span>}
                    </div>
                    <span className={styles.points}>{achievement.exp}Toks</span>
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

    return (
        <div className={styles.outsidecontainer}>
            <div className={styles.achievementContainer}>
                <div className={styles.leftSideContainer}>
                    <div className={styles.leftPanel}>
                        <h1 className={styles.title}>업적</h1>
                        <div className={styles.profile}>
                            <ProfileComposition />
                        </div>
                        <div className={styles.categoryMenu}>
                            <button
                                key="all-category"
                                className={selectedCategory === "전체" ? styles.active : ""}
                                onClick={() => setSelectedCategory("전체")}
                            >
                                전체
                            </button>
                            {Object.keys(groupedAchievements).map(category => (
                                <button
                                    key={category}
                                    className={selectedCategory === category ? styles.active : ""}
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className={styles.centerPanel}>
                    <div className={styles.recentcenterPanel}>
                        <div className={styles.achievementGrid}>
                            {(selectedCategory === "전체"
                                ? achievements
                                : groupedAchievements[selectedCategory] || []
                            ).map(achievement => renderAchievementCard(achievement))}
                        </div>
                    </div>
                </div>
                <div className={styles.rightPanel}>
                    <h3 className={styles.recentTitle}>최근 달성</h3>
                    <div className={styles.recentAchievements}>
                        {userAchievements.filter((ma): ma is MyAchievement & { achieved_at: string } => ma.achieved_at !== null).length === 0 ? (
                            <div className={styles.noAchievements}>
                                최근 달성한 업적이 없습니다.
                            </div>
                        ) : (
                            userAchievements
                                .filter((ma): ma is MyAchievement & { achieved_at: string } => ma.achieved_at !== null)
                                .sort((a, b) => new Date(b.achieved_at).getTime() - new Date(a.achieved_at).getTime())
                                .map(ma => (
                                    <div key={ma.myAchievementId} className={styles.recentItem}>
                                        <div className={styles.recentInfo}>
                                            <span>{ma.achievementsList.title}</span>
                                            <span className={styles.date}>
                                                {new Date(ma.achieved_at).toLocaleString('ko-KR', {
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

export default MyAchievements;
