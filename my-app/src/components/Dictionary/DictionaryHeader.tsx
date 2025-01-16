import React from 'react';
import './DictionaryHeader.css';
import logo from '../../image/Dictionary/TalkVillageLogo.png'

interface DictionaryHeaderProps {
  title: string;
}

const DictionaryHeader: React.FC<DictionaryHeaderProps> = ({ title }) => {
  return (
    <header>
        <div className="dictionary-header">
        <div className="logo-section">
            {/* <span className="logo-text">Daum</span> */}
            <img className='logo-img' src={logo} alt='logo'/>
            <span className="header-title">사전</span>
        </div>
        <nav className="nav-links">
            <a href="#">백과사전</a>
            <span className='txt_bar'>|</span>
            <a href="#">단어장</a>            
            <span className='txt_bar'>|</span>
            <a href="#">맞춤법검사기</a>
            <span className='txt_bar'>|</span>
            <a href="#">번역</a>
        </nav>
        <div className="user-actions">
            <button className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
};

export default DictionaryHeader;