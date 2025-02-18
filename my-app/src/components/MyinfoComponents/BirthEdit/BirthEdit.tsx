import React, { useState } from 'react';
import styles from './BirthEdit.module.css';

interface BirthEditProps {
    userInfo: any;
    onRefresh: () => void;
    setActivePanel: (panel: 'info' | 'nickname' | 'password' | 'birthdate' | 'withdrawal') => void;
}

const BirthEdit: React.FC<BirthEditProps> = ({ userInfo, onRefresh }) => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    // 현재 년도 계산
    const currentYear = new Date().getFullYear();
    
    // 년도 옵션 생성 (1900년부터 현재까지)
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    
    // 월 옵션 생성
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // 일 옵션 생성
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month, 0).getDate();
    };

    const handleSave = async () => {
        if (!year || !month || !day) {
            setStatusMessage('모든 항목을 선택해주세요.');
            return;
        }

        try {
            const birthdate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            
            const response = await fetch('http://localhost:9999/api/user/update/birthdate', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ birthdate }),
                credentials: 'include',
            });

            if (response.ok) {
                setStatusMessage('생년월일이 성공적으로 변경되었습니다.');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setStatusMessage('생년월일 변경에 실패했습니다.');
            }
        } catch (error) {
            setStatusMessage('서버 오류가 발생했습니다.');
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.birthPanel}>
            <div className={styles.birthPanelContent}>
                <h2>생년월일 변경</h2>
                
                <div className={styles.currentBirth}>
                    <label>현재 생년월일</label>
                    <p>{userInfo.birthdate}</p>
                </div>

                <div className={styles.inputGroup}>
                    <label>새로운 생년월일</label>
                    <div className={styles.birthInputGroup}>
                        <select 
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">년도</option>
                            {years.map(y => (
                                <option key={y} value={y}>{y}년</option>
                            ))}
                        </select>

                        <select 
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">월</option>
                            {months.map(m => (
                                <option key={m} value={m.toString().padStart(2, '0')}>
                                    {m}월
                                </option>
                            ))}
                        </select>

                        <select 
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">일</option>
                            {year && month && Array.from(
                                { length: getDaysInMonth(Number(year), Number(month)) },
                                (_, i) => i + 1
                            ).map(d => (
                                <option key={d} value={d.toString().padStart(2, '0')}>
                                    {d}일
                                </option>
                            ))}
                        </select>
                    </div>
                    {statusMessage && (
                        <span className={styles.statusMessage}>
                            {statusMessage}
                        </span>
                    )}
                </div>

                <button
                    onClick={handleSave}
                    disabled={!year || !month || !day}
                    className={styles.saveButton}
                >
                    저장
                </button>

                
            </div>
        </div>
    );
};

export default BirthEdit; 