import React, { useEffect, useState } from 'react';
import styles from './ProfileSetting.module.css';
import { useNavigate } from 'react-router-dom';
import skin1 from '../../image/basicSkin/skin1.png';
import skin2 from '../../image/basicSkin/skin2.png';
import skin3 from '../../image/basicSkin/skin3.png';
import skin4 from '../../image/basicSkin/skin4.png';

// 스킨 매핑 타입 정의
type SkinMapping = {
    [key: number]: string;
};

const ProfileSetting: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [basicSkin, setBasicSkin] = useState<string | null>(null);
    const [nicknameError, setNicknameError] = useState<string>('');
    const [userInfo, setUserInfo] = useState<any>(null);
    const [isComposing, setIsComposing] = useState(false); // 한글 조합 상태 체크
    const [isLoading, setIsLoading] = useState(false);
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{
        skin?: string;
        nickname?: string;
        birthday?: string;
        type: 'error' | 'success';
    } | null>(null);
    const navigate = useNavigate();

    // 스킨 매핑 객체에 타입 적용
    const skinMapping: SkinMapping = {
        1: 'skin-100',
        2: 'skin-200',
        3: 'skin-300',
        4: 'skin-400'
    };

    // 프로필 저장 함수
    const handleSave = async () => {
        setStatusMessage(null);
        
        if (basicSkin === null) {
            setStatusMessage({skin: '캐릭터 설정이 되어있지 않습니다.', type: 'error'});
            return;
        } else if (!nickname) {
            setStatusMessage({nickname: '닉네임을 입력해 주세요.', type: 'error'});
            return;
        }else if (!isDuplicateChecked) {
                setStatusMessage({nickname: '닉네임 중복 확인을 해주세요.', type: 'error'});
                return;
            
        } else if (!year || !month || !day) {
            setStatusMessage({birthday: '생년월일을 입력해 주세요.', type: 'error'});
            return;
        }

        const birthday = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const params = new URLSearchParams();
        params.append('nickname', nickname);
        params.append('birthday', birthday);
        params.append('basicSkin', basicSkin);

        try {
            const response = await fetch('http://localhost:9999/api/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
                credentials: 'include',
            });

            if (response.ok) {
                await fetch('http://localhost:9999/api/achievement/attend', {
                    method: 'GET',
                    credentials: 'include'
                })
                setTimeout(() => navigate('/mainmap'), 1000);
            } else {
                setStatusMessage({nickname: '프로필 저장에 실패했습니다.', type: 'error'});
            }
        } catch (error) {
            setStatusMessage({nickname: '서버에 연결할 수 없습니다.', type: 'error'});
        }
    };

    // 사용자 정보 가져오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:9999/api/user/nickname', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.text();
                    setUserInfo(data);

                    if (data !== 'Nameisnull') {
                        await fetch('http://localhost:9999/api/achievement/attend',{
                            method:'GET',
                            credentials : 'include'
                        })
                        navigate('/mainmap');
                    } else {
                        setIsLoading(true); // 닉네임이 없을 때만 로딩 완료
                    }
                } else {
                    console.error('Failed to fetch user info');
                    navigate('/mainmap');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, [navigate]);

    // 연도, 월, 일 옵션 생성
    const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    // 특수문자, 자음, 모음 방지 함수
    const preventSpecialCharsAndJamo = (value: string) => {
        const regex = /[ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()_+=\[\]{}|\\;:'",<>\./?]/g;
        return value.replace(regex, '');
    };

    // 닉네임 변경 처리
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDuplicateChecked(false);  // 닉네임 변경시 중복검사 초기화
        const value = e.target.value;

        if (!isComposing) { // 조합 완료 후에만 유효성 검사
            const filteredValue = preventSpecialCharsAndJamo(value);
            setNickname(filteredValue);

            if (filteredValue !== value) {
                setNicknameError('특수문자나 자음, 모음은 사용할 수 없습니다.');
            } else {
                setNicknameError('');
            }
        } else {
            setNickname(value); // 조합 중일 때는 유효성 검사를 하지 않음
        }
    };

    // 중복 검사 함수 추가
    const handleDuplicateCheck = async () => {
        if (!nickname.trim() || nicknameError) {
            return;
        }

        const filteredNickname = preventSpecialCharsAndJamo(nickname);
        if (filteredNickname !== nickname) {
            setNicknameError('특수문자나 자음, 모음은 사용할 수 없습니다.');
            return;
        }

        if (filteredNickname.length < 2) {
            setNicknameError('닉네임은 2글자 이상이어야 합니다.');
            return;
        }
        if (filteredNickname.length > 10) {
            setNicknameError('닉네임은 10글자 이하이어야 합니다.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:9999/api/user/check-name/${nickname}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.status === 200) {
                setNicknameError('');
                setStatusMessage({nickname: '', type: 'success'});
                setIsDuplicateChecked(true);
            } else if (response.status === 201) {
                setStatusMessage({nickname: '이미 사용 중인 닉네임입니다.', type: 'error'});
                setIsDuplicateChecked(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        !isLoading ? (
            <div className={styles.container}>
                <h1 className={styles.title}>로딩 중...</h1>
            </div>
        ) : (
            <div className={styles.container}>
                <div className={styles.profileOutBox}>
                    <h1 className={styles.title}>- 프로필 설정 -</h1>
                    <p className={styles.character}>기본 캐릭터 선택</p>
                    <div className={styles.skinSelection}>
                        {/* 스킨 선택 */}
                        {[skin1, skin2, skin3, skin4].map((skin, index) => (
                            <div
                                key={index + 1}
                                className={`${styles.skin} ${basicSkin === skinMapping[index + 1] ? styles.selected : ''}`}
                                onClick={() => setBasicSkin(skinMapping[index + 1])}
                            >
                                <img src={skin} alt={`Basic Skin ${index + 1}`} className='skinImg' />
                            </div>
                        ))}
                    </div>
                        {statusMessage?.skin && (
                            <span className={`${styles.errorText} ${styles.skinstatus}`}>{statusMessage.skin}</span>
                        )}
                    <div className={styles.inputGroup}>
                        <label>닉네임</label>
                        <div className={styles.nicknameInputGroup}>
                            <input
                                type="text"
                                value={nickname}
                                onChange={handleNicknameChange}
                                onCompositionStart={() => setIsComposing(true)}
                                onCompositionEnd={() => setIsComposing(false)}
                                className={`${styles.inputField} ${nicknameError ? styles.errorInput : ''}`}
                                placeholder="닉네임 입력"
                            />
                            <button 
                                type="button" 
                                onClick={handleDuplicateCheck}
                                className={styles.duplicateCheckButton}
                                disabled={!nickname.trim() || !!nicknameError}
                            >
                                중복확인
                            </button>
                        </div>
                        {nicknameError && <span className={styles.errorText}>{nicknameError}</span>}
                        {isDuplicateChecked && <span className={styles.successText}>사용 가능한 닉네임입니다.</span>}
                        {statusMessage?.nickname && (
                            <span className={styles.errorText}>{statusMessage.nickname}</span>
                        )}
                    </div>
                    <div className={styles.inputGroup}>
                        <label>생년월일</label>
                        <div className={styles.datePicker}>
                            <select value={year} onChange={(e) => setYear(e.target.value)}>
                                <option value="">년도</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}년</option>
                                ))}
                            </select>
                            <select value={month} onChange={(e) => setMonth(e.target.value)}>
                                <option value="">월</option>
                                {months.map((m) => (
                                    <option key={m} value={m.padStart(2, '0')}>{m}월</option>
                                ))}
                            </select>
                            <select value={day} onChange={(e) => setDay(e.target.value)}>
                                <option value="">일</option>
                                {days.map((d) => (
                                    <option key={d} value={d.padStart(2, '0')}>{d}일</option>
                                ))}
                            </select>
                        </div>
                        {statusMessage?.birthday && (
                            <span className={styles.errorText}>{statusMessage.birthday}</span>
                        )}
                    </div>
                    <button className={styles.saveButton} onClick={handleSave}>
                        저장
                    </button>
                </div>
            </div>
        )
    );
};

export default ProfileSetting;
