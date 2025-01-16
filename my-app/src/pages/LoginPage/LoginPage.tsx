import React from 'react';
import styles from './LoginPage.module.css';
import OauthPanel from '../../components/LoginPanel/oauthPanel/oauthPanel';
import SignupPanel from '../../components/LoginPanel/signupPanel/signupPanel';
import logo from '../../image/logos/TalkVillageLogo.svg';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.loginContainer}>
      <img src={logo} alt="로고" className={styles.logos} />
      <div className={styles.outlineContainer}>
        <div className={styles.panelContainer}>
          <div className={styles.signupSection}>
            <SignupPanel />
          </div>
          <div className={styles.oauthSection}>
            <OauthPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
