import React, { useState, useEffect, KeyboardEvent } from 'react';

// 데이터 타입 정의
interface DictionaryData {
  definitions: string[];
  examples: string[];
}

const DictionaryComponent: React.FC = () => {
  const [data, setData] = useState<DictionaryData | null>(null); // 서버에서 받은 데이터를 저장할 상태
  const [word, setWord] = useState<string>('');  // 사용자가 입력한 단어를 저장할 상태
  const [loading, setLoading] = useState<boolean>(false);  // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null);  // 오류 상태 추가
  const [inputValue, setInputValue] = useState<string>('');  // 입력창에 입력된 단어

  // 단어 검색 함수
  const searchWord = () => {
    if (!inputValue.trim()) return;  // 입력값이 없으면 검색하지 않음
    setLoading(true);  // API 호출 시작할 때 로딩 상태 true
    setError(null);  // 이전 오류 초기화
    fetch(`http://localhost:9999/define?word=${inputValue}`)  // 입력한 단어로 API 호출
      .then(response => {
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }
        return response.json();  // JSON 응답 받기
      })
      .then((data: DictionaryData) => {
        setData(data);  // 받은 데이터를 상태에 저장
        setLoading(false);  // 데이터를 받은 후 로딩 종료
        setWord(inputValue);  // 현재 검색 중인 단어를 업데이트
      })
      .catch(error => {
        setError(error.message);  // 에러 발생 시 에러 메시지 저장
        setLoading(false);  // 에러가 발생해도 로딩 종료
      });
  };

  // 엔터 키로 검색을 실행하는 함수
  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      searchWord();  // Enter 키를 누르면 검색 실행
    }
  };

  // {it} 태그를 <i>로 변환하는 함수
  const formatText = (text: string) => {
    return text
      .replace(/{it}/g, '<i>')  // {it}를 <i>로 변환
      .replace(/{\/it}/g, '</i>');  // {/it}를 </i>로 변환
  };

  if (loading) {
    return <div>Loading...</div>;  // 데이터를 불러오는 중
  }

  if (error) {
    return <div>Error: {error}</div>;  // 에러 발생 시 메시지 출력
  }

  return (
    <div>
      <h1>Dictionary Search</h1>

      {/* 단어 입력창 */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}  // 입력된 값을 inputValue에 저장
        onKeyPress={handleKeyPress}  // 엔터 키로 검색 실행
        placeholder="Enter a word"
        style={{
          width: '400px',  // 너비 조정
          height: '40px',  // 높이 조정
          padding: '10px',  // 내부 여백 추가
          fontSize: '16px',  // 글자 크기 조정
        }}
      />
      <button
        onClick={searchWord}
        style={{
          marginLeft: '10px',  // 입력창과 버튼 사이의 간격
          width: '150px',  // 너비 조정
          height: '50px',  // 높이 조정
          fontSize: '16px',  // 글자 크기 조정
        }}
      >
        Search
      </button>  {/* 클릭 시 단어 검색 */}

      {data && (
        <div>
          <h2>Word: {word}</h2>
          <h2>Definitions:</h2>
          {data.definitions && data.definitions.length > 0 ? (
            <ul>
              {data.definitions.map((definition, index) => (
                <li key={index}>{definition}</li>
              ))}
            </ul>
          ) : (
            <p>No definitions found for this word.</p>  // 정의가 없을 때 메시지 출력
          )}
          
          <h2>Examples:</h2>
          {data.examples && data.examples.length > 0 ? (
            <ul>
              {data.examples.map((example, index) => (
                <li
                  key={index}
                  dangerouslySetInnerHTML={{ __html: formatText(example) }}  // {it} 태그를 <i>로 변환
                />
              ))}
            </ul>
          ) : (
            <p>No examples found for this word.</p>  // 예문이 없을 때 메시지 출력
          )}
        </div>
      )}
    </div>
  );
};

export default DictionaryComponent;
