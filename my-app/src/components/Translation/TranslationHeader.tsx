import React from 'react';
import './TranslationHeader.css';
import logo from '../../image/Dictionary/TalkVillageLogo.png'
import Translation from '../../pages/Dictionary/Translation';

interface DictionaryHeaderProps {
  title: string;
}

const TranslationHeader: React.FC<DictionaryHeaderProps> = ({ title }) => {
  return (
    <header>
        <div className="dictionary-header">
        <div className="logo-section">
            <img className='logo-img' src={logo} alt='logo'/>
            <span className="header-title">번역</span>
        </div>
        <div className="user-actions">
            <button className="login-button">로그인</button>
        </div>
      </div>
    </header>
  );
};

export default TranslationHeader;