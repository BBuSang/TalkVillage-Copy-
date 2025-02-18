import React from 'react';
import styles from './TranslationFooter.module.css';
import logo from '../../../../image/Dictionary/TalkVillageLogo.png'

const TranslationFooter: React.FC = () => {
    return (
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <ul className={styles.footerLinks}>
            <li><a href="/privacy">서비스 약관/정책</a></li>
            <li><a href="/report">권리침해신고</a></li>
            <li><a href="/support">사전 고객센터</a></li>
            <li><a href="/inquiry">사전 문의하기</a></li>
            <li><a href="/notice">공지사항</a></li>
          </ul>
          <p className={styles.footerCopyright}>ⓒ Talk village</p>
          <p className={styles.footerCopyright}>통합 인공지능 플랫폼, 'TalkVillage'의 번역 엔진(다국어 번역 처리 기술)을 적용한 기계번역 서비스입니다.</p>
        </div>
      </footer>
    );
  };
  
  export default TranslationFooter;