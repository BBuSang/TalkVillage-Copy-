import React from 'react';
import './DictionaryFooter.css';
import logo from '../../image/Dictionary/TalkVillageLogo.png'

const DictionaryFooter: React.FC = () => {
    return (
      <footer className="footer">
        <div className="footer-content">
          <ul className="footer-links">
            <li><a href="/privacy">서비스 약관/정책</a></li>
            <li><a href="/report">권리침해신고</a></li>
            <li><a href="/support">사전 고객센터</a></li>
            <li><a href="/inquiry">사전 문의하기</a></li>
            <li><a href="/notice">공지사항</a></li>
          </ul>
          <p className="footer-copyright">ⓒ Talk village</p>
        </div>
      </footer>
    );
  };
  
  export default DictionaryFooter;