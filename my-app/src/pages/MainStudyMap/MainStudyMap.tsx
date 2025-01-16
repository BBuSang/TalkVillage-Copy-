// ThemeStudyChapter.tsx
import React from 'react';
import './LoginPage.css';
import OauthPanel from '../../components/LoginPanel/oauthPanel/oauthPanel';
import SignupPanel from '../../components/LoginPanel/signupPanel/signupPanel';

const LoginPage: React.FC = () => {
  return (
    <div>
      <OauthPanel />
      <SignupPanel/>
    </div>
  );
};

export default LoginPage;
