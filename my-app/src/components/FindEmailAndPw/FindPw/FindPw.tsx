import React, { useState } from 'react';
import styles from './FindPw.module.css';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

export default function FindPW() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isVerificationSent, setIsVerificationSent] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [verificationCodeError, setVerificationCodeError] = useState<string>(''); // 인증번호 오류 상태 추가
    const navigate = useNavigate();

    // 이메일 중복 검사 함수
    const handleEmailCheck = () => {
        if (!email) {
            alert('이메일을 입력해 주세요');
            return;
        }
        fetch('http://localhost:9999/api/findemail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: email }),
        })
        .then((response) => response.text().then((result) => {
                if (response.status === 200) {
                    alert('이메일을 찾을 수 없습니다.');
                    setIsEmailAvailable(false);
                    setIsVerificationSent(false);
                    setEmailError('');
                } else if (response.status === 409 && result==="exists" ) {
                    alert('이메일을 확인 했습니다.');
                    setIsEmailAvailable(true);
                    setEmailError('');
                }else if (response.status === 409 && result === "변경불가"){
                    alert('이메일을 확인했습니다.\n변경할 수 없는 계정입니다.')
                    setIsEmailAvailable(false);
                    setIsVerificationSent(false);
                    setEmailError("");
                } else {
                    alert('오류 발생: 이메일 중복 검사 실패');
                }
            }))
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    // 이메일 인증 함수
    const handleEmailVerification = () => {
        fetch('http://localhost:9999/api/mailSend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ email: email }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('인증 이메일이 발송되었습니다.');
                    setIsVerificationSent(true);
                } else {
                    return response.json().then((data) => {
                        alert(`메일 발송 실패: ${data.error}`);
                    });
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    // 인증번호 확인 함수
    const handleVerifyCode = () => {
        if (!verificationCode) {
            setVerificationCodeError('인증번호를 입력해주세요.');
            return;
        }

        fetch(`http://localhost:9999/api/mailCheck?mail=${email}&userNumber=${verificationCode}`)
            .then((response) => {
                if (response.ok) {
                    alert('인증이 성공적으로 완료되었습니다.');
                    setIsEmailVerified(true);
                    setVerificationCodeError(''); // 인증번호 오류 초기화
                } else {
                    setVerificationCodeError('인증번호가 일치하지 않습니다.');
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    // 비밀번호 유효성 검사 함수
    const validatePassword = (pwd: string) => {
        setPassword(pwd);
        if (pwd.length >= 8) {
            setPasswordError('');
            setIsPasswordValid(pwd === confirmPassword);
        } else {
            setPasswordError('비밀번호는 8자리 이상이어야 합니다.');
            setIsPasswordValid(false);
        }
    };

    // 비밀번호 확인 검사 함수
    const validateConfirmPassword = (confirmPwd: string) => {
        setConfirmPassword(confirmPwd);
        if (confirmPwd !== password) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
            setIsPasswordValid(false);
        } else {
            setConfirmPasswordError('');
            setIsPasswordValid(true);
        }
    };

    // 비밀번호 변경 함수
    const handleSignup = () => {
        if (!isEmailVerified || !isPasswordValid) {
            alert('이메일 인증 및 비밀번호 조건을 충족해야 합니다.');
            return;
        }

        fetch('http://localhost:9999/api/changePW', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                email: email,
                pw: password,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert('비밀번호 변경 성공');
                    navigate('/login');
                } else {
                    return response.text().then((errorText) => {
                        alert(`비밀번호 변경 실패: ${errorText}`);
                    });
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    return (
        <div className={styles.signupContainer}>
            <h2 className={styles.signupTitle}> - 비밀번호 변경 - </h2>
            <div className={styles.inputBox}>
                {/* 이메일 입력 및 인증 */}
                {!isEmailVerified && (
                    <>
                        <div className={styles.inputGroup}>
                            <input
                                type="email"
                                placeholder="이메일"
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${styles.Input} ${emailError ? styles.errorInput : ''}`}
                            />
                            <button onClick={handleEmailCheck} className={styles.verifyButton}>
                                이메일 확인
                            </button>
                        </div>

                        {isEmailAvailable && (
                            <div className={styles.inputGroup1}>
                                <input
                                    type="number"
                                    placeholder="인증번호 입력"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className={`${styles.Input} ${verificationCodeError ? styles.errorInput : ''}`}
                                />
                                {verificationCodeError && <div className={styles.errorMessage}>{verificationCodeError}</div>}
                                {!isVerificationSent ? (
                                    <button onClick={handleEmailVerification} className={styles.verifyButton1}>
                                        인증번호전송
                                    </button>
                                ) : (
                                    <button onClick={handleVerifyCode} className={styles.verifyButton}>
                                        확인
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* 비밀번호 변경 */}
                {isEmailVerified && (
                    <>
                        <div className={styles.inputGroup3}>
                            <input
                                type="password"
                                placeholder="비밀번호"
                                onChange={(e) => validatePassword(e.target.value)}
                                className={`${styles.Input1 } ${passwordError ? styles.errorInput : ''}`}
                            />
                            {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
                        </div>
                        <div className={styles.inputGroup3}>
                            <input
                                type="password"
                                placeholder="비밀번호 확인"
                                onChange={(e) => validateConfirmPassword(e.target.value)}
                                className={`${styles.Input1} ${confirmPasswordError ? styles.errorInput : ''}`}
                            />
                            {confirmPasswordError && <div className={styles.errorMessage}>{confirmPasswordError}</div>}
                        </div>
                        <div className={styles.inputGroup2}>
                            <button
                                onClick={handleSignup}
                                disabled={!isPasswordValid}
                                className={styles.verifyButton3}
                            >
                                비밀번호 변경
                            </button>
                        </div>
                    </>
                )}
            </div>
            <Tooltip id="my-tooltip" place="left" />
        </div>
    );
}
