import React from 'react';
import styles from './OauthPanel.module.css';

interface OauthPanelProps {
  returnUrl?: string;
}

const OauthPanel: React.FC<OauthPanelProps> = () => {
  const handleOAuthLogin = async (provider: string) => {
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
    console.log('returnUrl from query:', returnUrl);
    
    if (returnUrl) {
      try {
        const response = await fetch('http://localhost:9999/api/auth/saveReturnUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ returnUrl }),
          credentials: 'include',
          mode: 'cors'
        });
        
        if (!response.ok) {
          throw new Error('Failed to save returnUrl');
        }
        
        console.log('Successfully saved returnUrl to session');
      } catch (error) {
        console.error('Failed to save returnUrl:', error);
      }
    }

    // OAuth 로그인 페이지로 이동
    const oauthUrl = `http://localhost:9999/oauth2/authorization/${provider}`;
    window.location.href = oauthUrl;
  };

  return (
    <div className={styles.oauthPanel}>
      <button onClick={() => handleOAuthLogin('google')}>Google 로그인</button>
      <button onClick={() => handleOAuthLogin('naver')}>Naver 로그인</button>
    </div>
  );
};

export default OauthPanel; 