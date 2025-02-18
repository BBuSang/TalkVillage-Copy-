import React, { useState, useEffect } from 'react';
import styles from './PWEdit.module.css';
import { useNavigate } from 'react-router-dom';
interface PWEditProps {
    userInfo: any;
    onRefresh: () => void;
    setActivePanel: (panel: 'info' | 'nickname' | 'password' | 'birthdate' | 'withdrawal') => void;
}

const PWEdit: React.FC<PWEditProps> = ({ userInfo, onRefresh, setActivePanel }) => {
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isVerificationSent, setIsVerificationSent] = useState<boolean>(false);
    const [verificationCodeError, setVerificationCodeError] = useState<string>('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStatus, setPasswordStatus] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isSocialLogin, setIsSocialLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo.provider !== '회원가입') {
            setIsSocialLogin(true);
        }
    }, [userInfo.provider]);

    // 이메일 인증 요청
    const handleEmailVerification = () => {
        fetch('http://localhost:9999/api/mailSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: userInfo.email }),
        })
            .then((response) => {
                if (response.ok) {
                    setIsVerificationSent(true);
                    setPasswordStatus('이메일 확인 후 인증번호를 입력해주세요');
                } else {
                    alert('메일 발송에 실패했습니다.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('오류가 발생했습니다.');
            });
    };

    // 인증번호 확인
    const handleVerifyCode = () => {
        if (!verificationCode) {
            setVerificationCodeError('인증번호를 입력해주세요.');
            return;
        }

        fetch(`http://localhost:9999/api/mailCheck?mail=${userInfo.email}&userNumber=${verificationCode}`)
            .then((response) => {
                if (response.ok) {
                    setIsEmailVerified(true);
                    setVerificationCodeError('');
                } else {
                    setVerificationCodeError('인증번호가 일치하지 않습니다.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setVerificationCodeError('오류가 발생했습니다.');
            });
    };

    // 비밀번호 유효성 검사
    const validatePassword = (pwd: string) => {
        setNewPassword(pwd);
        if (pwd.length < 8) {
            setPasswordError('비밀번호는 8자리 이상이어야 합니다.');
            setIsPasswordValid(false);
        } else {
            setPasswordError('');
            setIsPasswordValid(pwd === confirmPassword);
        }
    };

    // 비밀번호 확인 검사
    const validateConfirmPassword = (confirmPwd: string) => {
        setConfirmPassword(confirmPwd);
        if (confirmPwd !== newPassword) {
            setPasswordError('비밀번호가 일치하지 않습니다.');
            setIsPasswordValid(false);
        } else if (newPassword.length >= 8) {
            setPasswordError('');
            setIsPasswordValid(true);
        }
    };

    // 비밀번호 변경
    const handlePasswordChange = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/changePW', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email: userInfo.email,
                    pw: newPassword,
                }),
            });

            if (response.ok) {
                fetch('http://localhost:9999/api/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                });
                navigate('/login');
            } else if (response.status === 205) {

            } else {
                setPasswordError('비밀번호 변경에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            setPasswordError('서버 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.passwordContainer}>
            <div className={styles.passwordContainerContent}>
                {isSocialLogin ? (
                    <div className={styles.socialLoginContainer}>
                        <div className={styles.socialLoginIcon}>!</div>
                        <div className={styles.socialLoginTextContainer}>
                            <div className={styles.socialLoginTextTitle}>
                                <p>사이트 이용에 불편을 드려 죄송합니다.</p>
                            </div>
                            <div className={styles.socialLoginText}>
                                <p>소셜 로그인 계정은 비밀번호 변경이 불가능합니다.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {!isEmailVerified ? (
                            <div className={styles.passwordChangeContainer}>
                                <div className={styles.passwordChangeTitleContainer}>
                                    <div className={styles.passwordChangeTitle}>비밀번호 변경</div>
                                    <div className={styles.passwordChangeText}>이메일 인증</div>
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="text"
                                            value={userInfo.email}
                                            disabled
                                            className={styles.input}
                                        />
                                        <button
                                            onClick={handleEmailVerification}
                                            className={styles.verifyButton}
                                            disabled={isVerificationSent}
                                        >
                                            {isVerificationSent ? '인증번호 전송됨' : '인증번호 전송'}
                                        </button>
                                    </div>
                                    <div className={styles.passwordStatus}>{passwordStatus}</div>
                                </div>
                                {isVerificationSent && (
                                    <div className={styles.inputGroup}>
                                        <input
                                            type="number"
                                            placeholder="인증번호 입력"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className={styles.input}
                                        />
                                        <button
                                            onClick={handleVerifyCode}
                                            className={styles.verifyButton}
                                        >
                                            확인
                                        </button>
                                        {verificationCodeError && (
                                            <div className={styles.errorMessage}>{verificationCodeError}</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.passwordChangeContainer}>
                                <div className={styles.passwordChangeTitle}>비밀번호 변경</div>
                                <div className={styles.passwordChangeText}>새 비밀번호 입력</div>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="password"
                                        placeholder="새 비밀번호"
                                        value={newPassword}
                                        onChange={(e) => validatePassword(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.inputGroup}>
                                    <input
                                        type="password"
                                        placeholder="새 비밀번호 확인"
                                        value={confirmPassword}
                                        onChange={(e) => validateConfirmPassword(e.target.value)}
                                        className={styles.input}
                                    />
                                </div>
                                {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
                                <button
                                    onClick={handlePasswordChange}
                                    disabled={!isPasswordValid}
                                    className={styles.changeButton}
                                >
                                    비밀번호 변경
                                </button>
                            </div>
                        )}
                        
                        <div className={styles.warningContainer}>
                            <div className={styles.warningIcon}>!</div>
                            <div className={styles.warningTextContainer}>
                                <div className={styles.warningTitle}>
                                    비밀번호 변경 시 유의사항
                                </div>
                                <div className={styles.warningText}>
                                    <p>• 비밀번호는 8자리 이상이어야 합니다.</p>
                                    <p>• 비밀번호는 주기적으로 변경하는 것이 안전합니다.</p>
                                    <p>• 개인정보와 관련된 문자, 연속된 문자 같이 쉬운 비밀번호는 자제바랍니다.</p>
                                    <p>• 비밀번호 변경 시 즉시 <strong>로그아웃</strong>됩니다.</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PWEdit;  
