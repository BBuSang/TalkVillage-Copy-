import React, { useState } from 'react';
import styles from './NicknameEdit.module.css';

interface NicknamePanelProps {
    userInfo: any;
    onRefresh: () => void;
    setActivePanel: (panel: 'info' | 'nickname' | 'password' | 'birthdate' | 'withdrawal') => void;
}

const NicknamePanel: React.FC<NicknamePanelProps> = ({ userInfo, onRefresh, setActivePanel }) => {
    const [nickname, setNickname] = useState('');
    const [nicknameError, setNicknameError] = useState<string>('');
    const [isComposing, setIsComposing] = useState(false);
    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const preventSpecialCharsAndJamo = (value: string) => {
        const regex = /[ㄱ-ㅎㅏ-ㅣ`~!@#$%^&*()_+=\[\]{}|\\;:'",<>\./?]/g;
        return value.replace(regex, '');
    };

    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        
        if (!isComposing) {
            const filteredValue = preventSpecialCharsAndJamo(value);
            setNickname(filteredValue);
            
            if (filteredValue === '') {
                setNicknameError('');
                setStatusMessage(null);
                setIsDuplicateChecked(false);
            } else if (filteredValue !== value) {
                setNicknameError('특수문자나 자음, 모음은 사용할 수 없습니다.');
                setStatusMessage(null);
                setIsDuplicateChecked(false);
            } else {
                setNicknameError('');
            }
        } else {
            setNickname(value);
        }
    };

    const handleDuplicateCheck = async () => {
        if (!nickname.trim() || nicknameError) return;

        const filteredNickname = preventSpecialCharsAndJamo(nickname);
        if (filteredNickname !== nickname) {
            setStatusMessage(null);
            setNicknameError('특수문자나 자음, 모음은 사용할 수 없습니다.');
            return;
        }

        if (filteredNickname.length < 2) {
            setStatusMessage(null);
            setNicknameError('닉네임은 2글자 이상이어야 합니다.');
            return;
        }
        if (filteredNickname.length > 10) {
            setStatusMessage(null);
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
                setStatusMessage('사용 가능한 닉네임입니다.');
                setIsDuplicateChecked(true);
            } else if (response.status === 201) {
                setNicknameError('');
                setStatusMessage('이미 사용 중인 닉네임입니다.');
                setIsDuplicateChecked(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSave = async () => {
        if (!isDuplicateChecked) {
            setStatusMessage('닉네임 중복 확인을 해주세요.');
            return;
        }

        // 마지막 유효성 검사
        const filteredNickname = preventSpecialCharsAndJamo(nickname);
        if (filteredNickname !== nickname) {
            setStatusMessage(null);
            setNicknameError('특수문자나 자음, 모음은 사용할 수 없습니다.');
            return;
        }

        if (filteredNickname.length < 2) {
            setStatusMessage(null);
            setNicknameError('닉네임은 2글자 이상이어야 합니다.');
            return;
        }

        if (filteredNickname.length > 10) {
            setStatusMessage(null);
            setNicknameError('닉네임은 10글자 이하이어야 합니다.');
            return;
        }

        // 최종 중복 체크
        try {
            const checkResponse = await fetch(`http://localhost:9999/api/user/check-name/${nickname}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (checkResponse.status === 201) {
                setNicknameError('');
                setStatusMessage('이미 사용 중인 닉네임입니다.');
                setIsDuplicateChecked(false);
                return;
            }

            // 모든 검사를 통과하면 저장 진행
            const response = await fetch(`http://localhost:9999/api/user/update/nickname`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nickname }),
                credentials: 'include',
            });

            if (response.status === 205) {
                setStatusMessage("");
                setNicknameError('30일 이내에 닉네임을 변경할 수 없습니다.');
            } else if (response.status === 200) {
                setStatusMessage('닉네임이 성공적으로 변경되었습니다.');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                setStatusMessage('닉네임 변경에 실패했습니다.');
            }
        } catch (error) {
            setStatusMessage('서버 오류가 발생했습니다.');
            console.error('Error:', error);
        }
    };

    return (
        <div className={styles.nicknamePanel}>
            <div className={styles.nicknamePanelContent}>
                <h2>닉네임 변경</h2>
                <div className={styles.currentNickname}>
                    <label>현재 닉네임</label>
                    <p>{userInfo.name}</p>
                </div>
                <div className={styles.inputGroup}>
                    <label>새로운 닉네임</label>
                    <div className={styles.nicknameInputGroup}>
                        <input
                            type="text"
                            value={nickname}
                            onChange={handleNicknameChange}
                            onCompositionStart={() => setIsComposing(true)}
                            onCompositionEnd={() => setIsComposing(false)}
                            className={nicknameError ? styles.errorInput : ''}
                            placeholder="새로운 닉네임 입력"
                        />
                        <button
                            onClick={handleDuplicateCheck}
                            disabled={!nickname.trim() || !!nicknameError}
                        >
                            중복확인
                        </button>
                    </div>
                    {nicknameError && <span className={styles.errorText}>{nicknameError}</span>}
                    {statusMessage && (
                        <span className={`${styles.statusMessage} ${isDuplicateChecked ? styles.success : styles.error}`}>
                            {statusMessage}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleSave}
                    disabled={!isDuplicateChecked || !!nicknameError}
                    className={styles.saveButton}
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default NicknamePanel;
