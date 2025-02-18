import { useEffect, useState } from 'react';
import styles from './Myinfo.module.css';
import ProfileComposition from '../ProfileComposition/ProfileComposition';
import { useNavigate } from 'react-router-dom';
import NicknamePanel from '../../components/MyinfoComponents/NicknameEdit/NicknameEdit';
import Exp from '../../components/Exp/Exp';
import { GenerateExpTable } from '../../components/GenerateExpTable/GenerateExpTable';
import PWEdit from '../../components/MyinfoComponents/PWEdit/PWEdit';
import BirthEdit from '../../components/MyinfoComponents/BirthEdit/BirthEdit';
import DeleteID from '../../components/MyinfoComponents/DeleteID/DeleteID';

const MyInfo = () => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const navigate = useNavigate();
    const [activePanel, setActivePanel] = useState<'info' | 'nickname' | 'password' | 'birthdate' | 'withdrawal'>('info');
    const baseExp = 100;
    const growthRate = 1.12;
    const maxLevel = 100;

    const expTable = GenerateExpTable(baseExp, growthRate, maxLevel).map(entry => entry.cumulativeExp);

    // 레벨 계산 함수
    const calculateLevel = (exp: number) => {
        const levelIndex = expTable.findIndex(threshold => exp < threshold);
        return levelIndex === -1 ? expTable.length : levelIndex + 1;
    };

    // 다음 레벨까지 남은 경험치 계산
    const getRemainingExp = (exp: number) => {
        const levelIndex = expTable.findIndex(threshold => exp < threshold);
        if (levelIndex === -1) return 0; // 최대 레벨일 경우
        return expTable[levelIndex] - exp; // 다음 레벨 경험치 - 현재 경험치
    };

    // 다음 레벨까지 필요한 경험치 계산
    const getNextLevelExp = (exp: number) => {
        const levelIndex = expTable.findIndex(threshold => exp < threshold);
        return levelIndex === -1 ? expTable[expTable.length - 1] : expTable[levelIndex];
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/user/user', {
                credentials: 'include',
                cache: 'no-cache'
            });
            const data = await response.json();
            setUserInfo(data);
        }
        catch (error) {
            console.error('Error:', error);
            navigate('/login');
        }
    };

    const birthdate = userInfo?.birthdate?.split('-') || [];
    const birthdateYear = birthdate[0];
    const birthdateMonth = birthdate[1];
    const birthdateDay = birthdate[2];
    const birthdateString = userInfo ? `${birthdateYear}년 ${birthdateMonth}월 ${birthdateDay}일` : '';

    if (!userInfo) {
        return (
            <div className={styles.container}>
                <h1 className={styles.title}>로딩중...</h1>
            </div>
        );
    }

    return (
        <div className={styles.outsidecontainer}>
                <div className={styles.profileContainer}>
                    <h1 className={styles.title}>내 정보</h1>
                    <div className={styles.profile}>
                        <ProfileComposition />
                    </div>
                    <div className={styles.menuButtons}>
                        <div className={styles.buttonGroup}>
                            <button
                                className={`${styles.menuButton} ${activePanel === 'info' ? styles.active : ''}`}
                                onClick={() => setActivePanel('info')}
                            >
                                기본 정보
                            </button>
                        </div>

                        <div className={styles.buttonGroup}>
                            <button
                                className={`${styles.menuButton} ${activePanel === 'nickname' ? styles.active : ''}`}
                                onClick={() => setActivePanel('nickname')}
                            >
                                닉네임 변경
                            </button>
                            <button
                                className={`${styles.menuButton} ${activePanel === 'password' ? styles.active : ''}`}
                                onClick={() => setActivePanel('password')}
                            >
                                비밀번호 변경
                            </button>
                            <button
                                className={`${styles.menuButton} ${activePanel === 'birthdate' ? styles.active : ''}`}
                                onClick={() => setActivePanel('birthdate')}
                            >
                                생년월일 변경
                            </button>
                        </div>

                        <div className={`${styles.buttonGroup} ${styles.danger}`}>
                            <button
                                className={`${styles.menuButton} ${styles.danger} ${activePanel === 'withdrawal' ? styles.active : ''}`}
                                onClick={() => setActivePanel('withdrawal')}
                            >
                                회원탈퇴
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.infoCard}>
                    {activePanel === 'info' && (
                        <div className={styles.infoContainer}>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="email">이메일</label>
                                <p className={styles.infoValue}>{userInfo.email}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="nickname">닉네임</label>
                                <p className={styles.infoValue}>{userInfo.name}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="birthdate">생년월일</label>
                                <p className={styles.infoValue}>{birthdateString}</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="level">레벨</label>
                                <p className={styles.infoValue}>
                                    Lv.{userInfo ? calculateLevel(userInfo.exp) : 1}
                                    &nbsp;&nbsp;&nbsp;(다음 레벨까지 {userInfo ? getRemainingExp(userInfo.exp) : expTable[0]} exp)
                                </p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="exp">누적경험치</label>
                                <p className={`${styles.infoValue} ${styles.exp}`}>{userInfo.exp} exp</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="point">포인트<span className={styles.unit}> (toks)</span></label>
                                <p className={`${styles.infoValue} ${styles.point}`}>{userInfo.point} toks</p>
                            </div>
                            <div className={styles.infoItem}>
                                <label className={styles.infoLabel} htmlFor="signup">가입일</label>
                                <p className={styles.infoValue}>{userInfo.firstsignup}</p>
                            </div>
                        </div>
                    )}
                    {activePanel === 'nickname' && <NicknamePanel userInfo={userInfo} onRefresh={fetchUserInfo} setActivePanel={setActivePanel} />}
                    {activePanel === 'password' && <PWEdit userInfo={userInfo} onRefresh={fetchUserInfo} setActivePanel={setActivePanel} />}
                    {activePanel === 'birthdate' && <BirthEdit userInfo={userInfo} onRefresh={fetchUserInfo} setActivePanel={setActivePanel} />}
                    {activePanel === 'withdrawal' && <DeleteID userInfo={userInfo} />}
                </div>
            </div>
    );
};

export default MyInfo;