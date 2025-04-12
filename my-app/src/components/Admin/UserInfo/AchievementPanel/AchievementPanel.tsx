import React, { useEffect, useState } from 'react';
import styles from './AchievementPanel.module.css';

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
}

interface AchievementPanelProps {
    userId: number;
}

type SectionType = '진행 중' | '미시작' | '완료됨' | '전체';

const AchievementPanel: React.FC<AchievementPanelProps> = ({ userId }) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [userAchievements, setUserAchievements] = useState<MyAchievement[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("전체");
    const [selectedSection, setSelectedSection] = useState<SectionType>("전체");

    useEffect(() => {
        if (userId !== undefined) {
            fetchAchievements();
        }
    }, [userId]);

    const fetchAchievements = async () => {
        try {
            const [achievementsRes, userAchievementsRes] = await Promise.all([
                fetch('http://localhost:9999/api/achievement/list'),
                fetch(`http://localhost:9999/api/achievement/user/${userId}`)
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

    const updateUserAchievement = async (achievementId: number, newStatement: number) => {
        if (userId === undefined) return;

        try {
            const response = await fetch(
                `http://localhost:9999/api/achievement/update/${userId}/${achievementId}/${newStatement}`,
                { method: 'PUT' }
            );

            if (response.ok) {
                fetchAchievements();
            }
        } catch (error) {
            console.error('Error updating achievement:', error);
        }
    };

    const groupedAchievements = achievements.reduce((acc, achievement) => {
        const category = achievement.category || "기타";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(achievement);
        return acc;
    }, {} as Record<string, Achievement[]>);

    const filterAchievementsBySection = (achievements: Achievement[]) => {
        const filteredAchievements = achievements.filter(achievement => {
            const userAchievement = userAchievements.find(ua => 
                ua.achievementsList.achievementId === achievement.achievementId
            );
            const progress = userAchievement?.goal || 0;

            switch (selectedSection) {
                case '진행 중':
                    return progress > 0 && progress < achievement.goal;
                case '미시작':
                    return !userAchievement || progress === 0;
                case '완료됨':
                    return progress >= achievement.goal;
                default:
                    return true;
            }
        });
        return filteredAchievements;
    };

    const renderAchievementCard = (achievement: Achievement) => {
        const userAchievement = userAchievements.find(ua => 
            ua.achievementsList.achievementId === achievement.achievementId
        );
        const progress = userAchievement?.goal || 0;
        const isCompleted = progress >= achievement.goal;

        return (
            <div key={achievement.achievementId} className={`${styles.achievementCard} ${isCompleted ? styles.completed : ''}`}>
                <div className={styles.achievementHeader}>
                    <h3>{achievement.title}</h3>
                    <span className={styles.points}>{achievement.exp}P</span>
                </div>
                <p className={styles.content}>{achievement.content}</p>
                <div className={styles.progressControl}>
                    <div className={styles.progressButtons}>
                        <button 
                            onClick={() => updateUserAchievement(achievement.achievementId, Math.max(0, progress - 1))}
                            disabled={progress <= 0}
                        >
                            -
                        </button>
                        <input
                            type="number"
                            value={progress}
                            onChange={(e) => {
                                const newValue = Math.min(
                                    Math.max(0, parseInt(e.target.value) || 0),
                                    achievement.goal
                                );
                                updateUserAchievement(achievement.achievementId, newValue);
                            }}
                            min="0"
                            max={achievement.goal}
                        />
                        <button 
                            onClick={() => updateUserAchievement(achievement.achievementId, Math.min(achievement.goal, progress + 1))}
                            disabled={progress >= achievement.goal}
                        >
                            +
                        </button>
                        <span className={styles.goalText}>{progress}/{achievement.goal}</span>
                    </div>
                    <div className={styles.progressBar}>
                        <div
                            className={styles.progress}
                            style={{
                                width: `${(progress / achievement.goal) * 100}%`,
                                backgroundColor: isCompleted ? '#4CAF50' : '#007bff'
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.achievementPanel}>
            <div className={styles.controls}>
                <div className={styles.sectionMenu}>
                    {(['전체', '진행 중', '미시작', '완료됨'] as SectionType[]).map(section => (
                        <button
                            key={section}
                            className={selectedSection === section ? styles.active : ''}
                            onClick={() => setSelectedSection(section)}
                        >
                            {section}
                        </button>
                    ))}
                </div>
                <div className={styles.categoryMenu}>
                    <button
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

            <div className={styles.achievementGrid}>
                {filterAchievementsBySection(
                    selectedCategory === "전체"
                        ? achievements
                        : groupedAchievements[selectedCategory] || []
                ).map(achievement => renderAchievementCard(achievement))}
            </div>
        </div>
    );
};

export default AchievementPanel;
