import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResultHeader.css';
import logo from '../../image/Dictionary/TalkVillageLogo.png';
import read from '../../image/Dictionary/read.png';

const ResultHeader: React.FC = () => {
    const [searchWord, setSearchWord] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchWord.trim()) {
            navigate(`/result?word=${encodeURIComponent(searchWord.trim())}`);
            setSearchWord(''); // 검색 후 입력창 초기화
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <header>
            <div className="dictionary-header">
                <div className="logo-section">
                    <img className='logo-img' src={logo} alt='logo' />
                    <span className="header-title">사전</span>
                </div>
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="검색" 
                        className="search-bar"
                        value={searchWord}
                        onChange={(e) => setSearchWord(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <img 
                        src={read}
                        alt="검색 아이콘" 
                        className="search-icon"
                        onClick={handleSearch}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <nav className="nav-links">
                    <a href="#" className='text-head'>단어장</a>
                    <span className='txt_bar'>|</span>
                    <a href="#" className='text-head'>사전홈</a>
                    <span className='txt_bar'>|</span>
                    <a href="#" className='text-haed'>번역</a>
                </nav>
                <div className="user-actions">
                    <button className="login-button">로그인</button>
                </div>
            </div>
        </header>
    );
};

export default ResultHeader;