import React, { useState, useEffect } from 'react';
import styles from './ApiTest.module.css';
import DictionaryComponent from '../../components/Apis/DictionaryComponent';
import TranslationComponent from '../../components/Apis/TranslationComponent';

const ApiTest: React.FC = () => {
  const [message, setMessage] = useState<string>(''); // 상태 설정
  const [word, setWord] = useState<string>('example'); // 단어 상태

  useEffect(() => {
    // Spring Boot의 /api/hello API를 호출
    fetch('http://localhost:9999/api/hello') // Spring Boot 서버의 주소로 API 호출
      .then(response => response.text())
      .then(data => setMessage(data)) // 받은 데이터를 상태에 저장
      .catch(error => console.error('Error:', error)); // 에러 처리
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      {/* <h1>{message}</h1> */} {/* API 응답 출력 */}

      <div style={{ marginBottom: '40px' }}>
        <DictionaryComponent />
      </div>

      <hr style={{ margin: '40px 0', border: '1px solid #ccc' }} />

      <div style={{ marginTop: '40px' }}>
        <h1>Translation Search</h1>
        <TranslationComponent />
      </div>
    </div>
  );
};

export default ApiTest;
