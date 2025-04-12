import React, { useState } from 'react';
import styles from './AddStore.module.css';

const AdminPanel = () => {
  const [message, setMessage] = useState('');

  const handleDBInitialize = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/admin/basicskin', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('데이터베이스 추가가 완료되었습니다.');
      }
      else if(response.status === 400){
        setMessage('이미 추가되었습니다.');
      }
    } catch (error) {
      setMessage('오류가 발생했습니다: ' + error);
    }
  };

  const handleBackgroundAndNamePlate = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/admin/BackandName', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('데이터베이스 추가가 완료되었습니다.');
      }
      else if(response.status === 400){
        setMessage('이미 추가되었습니다.');
      }
    } catch (error) {
      setMessage('오류가 발생했습니다: ' + error);
    }
  };

  const handleAchievements = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/admin/achieve', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('데이터베이스 추가가 완료되었습니다.');
      }
      else if(response.status === 400){
        setMessage('이미 추가되었습니다.');
      }
    } catch (error) {
      setMessage('오류가 발생했습니다: ' + error);
    }
  };

  const handleQuestAddition = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/admin/quest', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        setMessage('퀘스트 추가가 완료되었습니다.');
      } else if (response.status === 400) {
        setMessage('이미 추가되었습니다.');
      }
    } catch (error) {
      setMessage('오류가 발생했습니다: ' + error);
    }
  };
  

  return (
    <div className={styles['admin-panel']}>
      <div className={styles['admin-controls']}>
        <button
          onClick={handleDBInitialize}
          className={styles['admin-button']}
        >
          스킨 DB 추가
        </button>
        <button
          onClick={handleBackgroundAndNamePlate}
          className={styles['admin-button']}
        >
          배경 및 이름표 DB 추가
        </button>
        <button
          onClick={handleAchievements}
          className={styles['admin-button']}
        >
          업적 DB 추가
        </button>
        <button
          onClick={handleQuestAddition}
          className={styles['admin-button']}
        >
          퀘스트 DB 추가
        </button>
        {message && (
          <div className={styles['admin-message']}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 