import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './signupPanel.module.css';

interface User {
    email: string;
    password: string;
}

function Login() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>({
        email: '',
        password: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('email', user.email);
            formData.append('password', user.password);

            const response = await fetch('http://localhost:9999/login', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                alert('로그인 성공! ');
                // console.log('유저 이메일: ' + data.email);
                // console.log('권한: ' + data.authorities);
                navigate('/ProfileSettings', { state: { userData: data } });
            } else {
                alert('이메일이 존재하지 않거나\n비밀번호가 일치하지 않습니다');
            }
        } catch (error) {
            console.log('로그인 에러: ', error);
            alert('ㅅㅂ로그인 또 오류났어 ㅈ됬어')
        }
    };

    // 회원가입 버튼 클릭 핸들러
    const handleSignupClick = () => {
        navigate('/signup'); // 회원가입 페이지로 이동
    };

    // 비밀번호 변경 버튼 클릭 핸들러
    const handleFindIdAndPwClick = () => {
        navigate('/findIDandPW'); // 비밀번호 변경 페이지로 이동
    };

    return (
        <div className={styles.signupPanel}>
            <form onSubmit={handleSubmit} className={styles.inputContainer}>
                <input
                    type="text"
                    name="email"
                    placeholder="이메일"
                    value={user.email}
                    className={styles.inputField}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={user.password}
                    className={styles.inputField}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className={styles.loginButton}>로그인</button>
            </form>
            <div className={styles.links}>
                <div className={styles.linkContainer}>
                    <button className={styles.linkButton} onClick={handleSignupClick}>회원 가입</button>
                    <div className={styles.separator}>  </div>
                    <button className={styles.linkButton} onClick={handleFindIdAndPwClick}>계정 찾기</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
