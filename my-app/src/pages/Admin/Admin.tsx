import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { useNavigate } from 'react-router-dom';
import AddHangmanWord from '../../components/Admin/Games/AddHangmanWord/AddHangmanWord';
import UserInfo from '../../components/Admin/UserInfo/UserInfo';
import AddScrambledWord from '../../components/Admin/Games/AddScrambledWord/AddScrambledWord';
import Store from '../../components/Admin/Store/AddStore';
import CrossWordAdmin from '../../components/Admin/Games/AddCrossWordAdmin/AddCrossWordAdmin';
import FileManager from '../../components/ThemePanel/QuesionManager/FileUploadAndView';

const AdminPage: React.FC = () => {
    const [currentView, setCurrentView] = useState<string>('default');
    const navigate = useNavigate();

    // 유저가 admin이 아니라면 들어올 수 없게 만듬
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch('http://localhost:9999/api/user/admin', {
                    method: 'GET',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.text();
                    if (data !== "admin") {
                        // 개발중에만 잠시 꺼둔것이니 개발이 끝나면 다시 켜야함
                        // navigate('/mainmap');
                    }
                } else {
                    console.error('admin 계정으로 로그인 후 다시 접속하십시오');
                    // 개발중에만 잠시 꺼둔것이니 개발이 끝나면 다시 켜야함
                    // navigate('/mainmap');
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);

    // 화면별 렌더링 컴포넌트 정의
    const renderView = () => {
        switch (currentView) {
            case 'hangman':
                return <AddHangmanWord />;
            case 'userInfo':
                return <UserInfo/>;
            case 'ScrambledWord':
                return <AddScrambledWord/>;
            case 'Store':
                return <Store />;
            case 'CrosswordAdmin':
                return <CrossWordAdmin/>;
            case 'filemanager':
                return <FileManager/>;
            case '2':
                return <div>2</div>;
            case '3':
                return <div>3</div>;
            case '4':
                return <div>4</div>;
            default:
                return <div>관리자 페이지 입니다</div>;
        }
    };

    return (
        <div className={styles.adminPage}>
            <div className={styles.buttonContainer}>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('userInfo')}
                >
                    User Info
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('hangman')}
                >
                    Hangman
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('ScrambledWord')}
                >
                    Word Scramble
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('CrosswordAdmin')}
                >
                    Crossword
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('filemanager')}
                >
                    filemanager
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('Store')}
                >
                    Store
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('2')}
                >
                    2
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('3')}
                >
                    3
                </button>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentView('4')}
                >
                    4
                </button>
            </div>
            <div className={styles.viewContainer}>{renderView()}</div>
        </div>
    );
};

export default AdminPage;
