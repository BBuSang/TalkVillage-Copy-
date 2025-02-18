import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TranslationHeader.module.css';
import logo from '../../../../image/Dictionary/TalkVillageLogo.png';

interface DictionaryHeaderProps {
  title: string;
}

const TranslationHeader: React.FC<DictionaryHeaderProps> = ({ title }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get('http://localhost:9999/api/auth/check', {
          withCredentials: true
        });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('로그인 상태 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogoClick = () => {
    navigate('/mainmap');  // /mainmap으로 수정
  };

  return (
    <header className={styles.header}>
      <div className={styles.dictionaryHeader}>
        <div className={styles.logoSection}>
          <img 
            className={styles.logoImg} 
            src={logo} 
            alt='logo'
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
          <span className={styles.headerTitle}>번역</span>
        </div>
        <div className={styles.userActions}>
          {!isLoggedIn && (
            <button 
              className={styles.loginButton}
              onClick={() => navigate('/login')}
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TranslationHeader;