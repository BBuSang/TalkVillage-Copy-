import React, { useState } from 'react';
import styles from './FindIdAndPW.module.css';
import FindEmail from '../../components/FindEmailAndPw/FindEmail/FindEmail';
import FindPw from '../../components/FindEmailAndPw/FindPw/FindPw';
import { useNavigate } from 'react-router-dom';

const FindIdAndPw: React.FC = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  const backToLogin = () => {
    navigate('/login');
  }
  return (
    <div className={styles.FindEmailAndPwContainer}>
      <div className={styles.findEmailAndPwBox}>
        <div className={styles.findBox}>
          <div className={styles.findEmail}>
            <FindEmail />
          </div>
          <div className={styles.line}></div>
          <div className={styles.findPw}>
            <FindPw />
          </div>
        </div>
      <button
        onClick={backToLogin}
        className={styles.backToLogin}
        >
        이전
      </button>
        </div>
    </div>
  );
};

export default FindIdAndPw;
