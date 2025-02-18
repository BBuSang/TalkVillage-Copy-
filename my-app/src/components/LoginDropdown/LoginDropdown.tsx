import React, { useState, useEffect } from 'react';
import styles from './LoginDropdown.module.css';
import CreateCanvasMap from '../CreateCanvasMap/CreateCanvasMap';
import LoginImage from '../../image/Icons/Login.png';
import { useNavigate } from 'react-router-dom';

const LoginDropdown: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:9999/api/user/user', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);
  const handleLogin = (Path:string) => {
    navigate(Path);
    setIsDropdownOpen(false);
  }

  const handleLogout = () => {
    fetch('http://localhost:9999/api/logout', {
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      setIsLoggedIn(false);
      navigate('/mainmap');
      window.location.reload();
    });
  }

  return (
    <div className={`${styles.topRightButtons} ${isDropdownOpen ? styles.clicked : ''}`}>
      <div 
        className={styles.loginButton}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <CreateCanvasMap imagePath={LoginImage} color="rgb(41, 85, 132)"/>
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdownMenu}>
          {isLoggedIn ? (
            <>
              <button className={styles.dropdownItem} onClick={() => handleLogin('/mainmap/myinfo')}    >내 정보</button>
              <button className={styles.dropdownItem} onClick={() => handleLogin('/mainmap/inventory')}>인벤토리</button>
              <button className={styles.dropdownItem} onClick={() => handleLogin('/mainmap/quest')}>퀘스트</button>
              <button className={styles.dropdownItem} onClick={() => handleLogin('/mainmap/achievement')}>업적</button>
              <button className={styles.dropdownItem} onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <div className={styles.dropdownItem} onClick={() => handleLogin('/login')}>로그인</div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoginDropdown; 