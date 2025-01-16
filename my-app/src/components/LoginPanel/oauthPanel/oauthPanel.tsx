import React from 'react';
import styles from './oauthPanel.module.css';
import google from '../../../image/logos/googleLogo.svg';
import kakao from '../../../image/logos/kakaoLogo.svg';
import naver from '../../../image/logos/naverLogo.svg';

export default function OauthPanel() {
    const handleClick = (providerPath: string) => {
        window.location.href = `http://localhost:9999${providerPath}`;
    };

    return (
        <div className={styles.oauthBox}>
            <span className={styles.header}>- 간편 로그인 -</span>
            <div className={styles.oauthPanel}>
                <div className={styles.logoOutborder}>
                    <button onClick={() => handleClick('/oauth2/authorization/google')} className={styles.imageButton}>
                        <img src={google} alt="구글로고" />
                    </button>
                </div>
                <div className={styles.logoOutborder}>
                    <button onClick={() => handleClick('/oauth2/authorization/kakao')} className={styles.imageButton}>
                        <img src={kakao} alt="카카오로고" />
                    </button>
                </div>
                <div className={styles.logoOutborder}>
                    <button onClick={() => handleClick('/oauth2/authorization/naver')} className={styles.imageButton}>
                        <img src={naver} alt="네이버로고" />
                    </button>
                </div>
            </div>
        </div>
    );
}
