import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './ResultHeader.module.css';
import logo from '../../../../image/Dictionary/TalkVillageLogo.png';
import read from '../../../../image/Dictionary/read.png';

interface AuthResponse {
    isLoggedIn: boolean;
    username?: string;
}

const ResultHeader: React.FC = () => {
    const [searchWord, setSearchWord] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:9999/api/auth/check', {
                    withCredentials: true
                });
                
                setIsLoggedIn(response.data.isLoggedIn);
                console.log('Login status:', response.data.isLoggedIn); // 디버깅용
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
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchWord.trim()) {
            navigate(`/result?word=${encodeURIComponent(searchWord.trim())}`);
            setSearchWord('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const handleNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <header className={styles.header}>
            <div className={styles.dictionaryHeader}>
                <div className={styles.logoSection}>
                    <img className={styles.logoImg} src={logo} alt='logo' onClick={handleLogoClick} style={{ cursor: 'pointer' }}/>
                    <span className={styles.headerTitle}>사전</span>
                </div>
                <div className={styles.searchContainer}>
                    <input 
                        type="text" 
                        placeholder="검색" 
                        className={styles.searchBar}
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <img 
                        src={read}
                        alt="검색 아이콘" 
                        className={styles.searchIcon}
                        onClick={handleSearch}
                    />
                </div>
                <nav className={styles.navLinks}>
                    <button 
                        onClick={() => handleNavigate('/mainmap/voca')} 
                        className={styles.textHead}
                    >
                        단어장
                    </button>
                    <span className={styles.txtBar}>|</span>
                    <button 
                        onClick={() => handleNavigate('/dictionary')} 
                        className={styles.textHead}
                    >
                        사전홈
                    </button>
                    <span className={styles.txtBar}>|</span>
                    <button 
                        onClick={() => handleNavigate('/translation')} 
                        className={styles.textHead}
                    >
                        번역
                    </button>
                </nav>
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

export default ResultHeader;