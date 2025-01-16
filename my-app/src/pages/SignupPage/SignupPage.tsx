import React, { useState } from 'react';
import styles from './SignupPage.module.css';
import logo from '../../image/logos/TalkVillageLogo.svg';
import { Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';

function SignupPanel() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isEmailAvailable, setIsEmailAvailable] = useState<boolean>(false);
    const [isVerificationSent, setIsVerificationSent] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [confirmPasswordError, setConfirmPasswordError] = useState<string>('');
    const [verificationCodeError, setVerificationCodeError] = useState<string>('');
    const navigate = useNavigate();

    // 이메일 중복 검사
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
            .then((response) => {
                if (response.status === 200) {
                    alert('이메일 사용 가능');
                    setIsEmailAvailable(true);
                    setIsVerificationSent(false);
                    setEmailError('');
                } else if (response.status === 409) {
                    alert('이메일이 이미 사용 중입니다.');
                    setIsEmailAvailable(false);
                    setEmailError('');
                } else {
                    alert('오류 발생: 이메일 중복 검사 실패');
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    // 이메일 인증
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

    // 인증번호 확인
    const handleVerifyCode = () => {
        fetch(`http://localhost:9999/api/mailCheck?mail=${email}&userNumber=${verificationCode}`)
            .then((response) => {
                if (response.ok) {
                    alert('인증이 성공적으로 완료되었습니다.');
                    setIsEmailVerified(true);
                    setVerificationCodeError('');
                } else {
                    return response.json().then((data) => {
                        alert(`인증번호가 일치하지 않습니다. 다시 입력해주세요.`);
                    });
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    const handleSignup = () => {
        if (!isEmailVerified || !isPasswordValid) {
            alert('이메일 인증 및 비밀번호 조건을 충족해야 합니다.');
            return;
        }

        fetch('http://localhost:9999/api/signup', {
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
                    alert('회원가입 성공');
                    navigate('/login');
                } else {
                    return response.text().then((errorText) => {
                        alert(`회원가입 실패: ${errorText}`);
                    });
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    const validatePassword = (pwd: string) => {
        setPassword(pwd);
        if (pwd.length < 8) {
            setPasswordError('비밀번호는 8자리 이상이어야 합니다.');
            setIsPasswordValid(false);
        } else {
            setPasswordError('');
            setIsPasswordValid(pwd === confirmPassword);
        }
    };

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

    const backToLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.signupContainer}>
            <div className={styles.signupBackground}>
                <h2 className={styles.signupTitle}> - 회원 가입 - </h2>
                <div className={styles.inputBox}>
                    <div className={styles.inputGroup}>
                        <input
                            type="email"
                            placeholder="이메일"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            className={`${styles.Input} ${emailError ? styles.errorInput : ''}`}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="이메일을 입력해주세요."
                        />
                        {emailError && <div className={styles.errorMessage}>{emailError}</div>}
                        <button onClick={handleEmailCheck} className={styles.verifyButton}>
                            중복 검사
                        </button>
                    </div>
                    <div className={styles.inputGroup1}>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            onChange={(e) => validatePassword(e.target.value)}
                            className={`${styles.passwordinput} ${passwordError ? styles.errorInput : ''}`}
                            disabled={!isEmailAvailable}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="비밀번호를 8자리 이상 입력해주세요."
                        />
                        {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
                    </div>
                    <div className={styles.inputGroup1}>
                        <input
                            type="password"
                            placeholder="비밀번호 확인"
                            onChange={(e) => validateConfirmPassword(e.target.value)}
                            className={`${styles.passwordinput} ${confirmPasswordError ? styles.errorInput : ''}`}
                            disabled={!isEmailAvailable}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="비밀번호를 한번더 입력해주세요"
                        />
                        {confirmPasswordError && <div className={styles.errorMessage}>{confirmPasswordError}</div>}
                    </div>
                    <div className={styles.inputGroup}>
                        <input
                            type="number"
                            placeholder="인증번호 입력"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className={`${styles.Input} ${verificationCodeError ? styles.errorInput : ''}`}
                            disabled={!isEmailAvailable}
                            data-tooltip-id="my-tooltip"
                            data-tooltip-content="메일 확인 후 인증번호를 입력해주세요."
                        />
                        {verificationCodeError && <div className={styles.errorMessage}>{verificationCodeError}</div>}
                        {!isVerificationSent ? (
                            <button onClick={handleEmailVerification} disabled={!isEmailAvailable} className={styles.verifyButton}>
                                이메일 인증
                            </button>
                        ) : (
                            <button onClick={handleVerifyCode} className={styles.verifyButton}>
                                확인
                            </button>
                        )}
                    </div>
                </div>
                <img src={logo} alt="로고" className={styles.logo} />
                <div>
                    <button
                        onClick={backToLogin}
                        className={styles.createAccountButton}
                    >
                        이전
                    </button>
                    <button
                        onClick={handleSignup}
                        disabled={!isEmailVerified || !isPasswordValid}
                        className={styles.createAccountButton}
                    >
                        계정 생성
                    </button>
                </div>
                <Tooltip id="my-tooltip" place="left"></Tooltip>
            </div>
        </div>
    );
}

export default SignupPanel;
