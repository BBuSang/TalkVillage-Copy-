import React, { useState } from 'react';
import styles from './FindEmail.module.css';
import { Tooltip } from 'react-tooltip';

export default function FindEmail() {
    // 이메일 중복 검사
    const [email, setEmail] = useState<string>('');

    const handleEmailCheck = () => {
        if (!email) {
            alert("이메일을 입력해 주세요");
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
                    alert('이메일이 존재하지 않습니다');
                } else if (response.status === 409) {
                    alert('이메일이 존재 합니다');
                } else {
                    alert('오류 발생: 이메일 중복 검사 실패');
                }
            })
            .catch((error) => {
                console.error('오류 발생:', error);
                alert('오류 발생');
            });
    };

    return (
        <div className={styles.signupContainer}>
            <h2 className={styles.signupTitle}> - 이메일 찾기 - </h2>
            <input
                type="email"
                placeholder="이메일을 입력해 주세요"
                onChange={(e) => {
                    setEmail(e.target.value);
                }}
                className={styles.findEmailInput}
                data-tooltip-id="my-tooltip"
                data-tooltip-content="이메일을 입력해주세요."
            />
            <button onClick={handleEmailCheck} className={styles.verifyButton}>
                이메일 확인
            </button>
            <Tooltip id="my-tooltip" place="left"></Tooltip>
        </div>
    );
}
