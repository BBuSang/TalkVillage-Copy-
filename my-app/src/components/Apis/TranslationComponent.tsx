import React, { useState, KeyboardEvent } from 'react';

const TranslationComponent: React.FC = () => {
  const [sentence, setSentence] = useState<string>('');  // 입력된 문장을 저장할 상태
  const [translation, setTranslation] = useState<string>('');  // 번역된 문장을 저장할 상태
  const [loading, setLoading] = useState<boolean>(false);  // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null);  // 오류 상태 관리

  const translateSentence = async () => {
    if (!sentence.trim()) return;  // 문장이 비어 있으면 처리하지 않음

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:9999/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: sentence,  // 번역할 문장
          target_lang: 'KO',  // 한국어로 번역
        }),
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.text();  // 텍스트로 응답 받음
      setTranslation(data);  // 번역 결과 저장

    } catch (error: any) {
      setError(`번역 중 오류가 발생했습니다: ${error.message}`);
      console.error('Error translating sentence:', error);
    } finally {
      setLoading(false);  // 로딩 상태 비활성화
    }
  };

  // 엔터 키 감지 함수
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      translateSentence();  // Enter 키가 눌리면 번역 함수 호출
    }
  };

  return (
    <div>
      <h2>Sentence Translation</h2>
      <input
        type="text"
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}  // 문장 입력받기
        onKeyPress={handleKeyPress}  // 엔터 키 이벤트 처리
        placeholder="Enter a sentence to translate"
        style={{
            width: '400px',  // 너비 조정
            height: '40px',  // 높이 조정
            padding: '10px',  // 내부 여백 추가
            fontSize: '16px',  // 글자 크기 조정
          }}
      />
      <button onClick={translateSentence} disabled={loading}
      style={{
        marginLeft: '10px',  // 입력창과 버튼 사이의 간격
        width: '150px',  // 너비 조정
        height: '50px',  // 높이 조정
        fontSize: '16px',  // 글자 크기 조정
      }}>Translate</button>

      {loading && <p>Translating...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {translation && (
        <div>
          <h3>Translation:</h3>
          <p>{translation}</p>  {/* 번역된 결과 출력 */}
        </div>
      )}
    </div>
  );
};

export default TranslationComponent;
