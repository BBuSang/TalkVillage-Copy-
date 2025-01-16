// import React, { useState } from 'react';
// import './Wordtest.css';

// // HomePage 컴포넌트 정의
// function Wordtest() {
//   const [sentence, setSentence] = useState<string>('');  // 입력된 문장 상태
//   const [tokens, setTokens] = useState<string[]>([]);    // 형태소 분석 결과 상태

//   // 입력 필드의 변화 처리
//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSentence(event.target.value);
//   };
  
//   // 폼 제출 시 Spring Boot 서버로 POST 요청
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     try {
//       const response = await fetch('http://localhost:9999/api/tokenize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(sentence),
//       });

//       if (response.ok) {
//         const result = await response.json();
//         setTokens(result);
//       } else {
//         console.error('Failed to fetch data from server.');
//       }
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="home-container">
//       <h1>English Sentence Tokenizer</h1>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={sentence}
//           onChange={handleInputChange}
//           placeholder="Enter a sentence"
//           className="sentence-input"
//         />
//         <button type="submit" className="tokenize-button">Tokenize</button>
//       </form>
//       {tokens.length > 0 && (
//         <div className="token-result">
//           <h2>Tokens:</h2>
//           <ul>
//             {tokens.map((token, index) => (
//               <li key={index}>{token}</li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Wordtest;

import React, { useState, useEffect } from 'react';
import './Wordtest.css';

// Question 타입 정의
interface Question {
  questionListId: number;
  stageLevel: string;
  question: string;
  result: string;
  type: string;
}

function Wordtest() {
  const [questions, setQuestions] = useState<Question[]>([]); // 질문 리스트 상태
  const [tokenResults, setTokenResults] = useState<{ [key: number]: string[] }>({}); // 형태소 분석 결과 상태

  // 데이터베이스의 질문 목록을 가져오는 함수
  const fetchQuestions = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data: Question[] = await response.json();
        setQuestions(data);
      } else {
        console.error('Failed to fetch data from server.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // 각 question의 형태소 분석을 수행하는 함수
  const fetchTokenizedResults = async (questionText: string, questionId: number) => {
    try {
      const response = await fetch('http://localhost:9999/api/tokenize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questionText }), // question 텍스트를 전송
      });

      if (response.ok) {
        const result = await response.json();
        setTokenResults((prevResults) => ({
          ...prevResults,
          [questionId]: result.tokens, // 응답에서 tokens 배열 사용
        }));
      } else {
        console.error('Failed to fetch tokenized data for question:', questionText);
      }
    } catch (error) {
      console.error('Error fetching tokenized data:', error);
    }
  };

  // questions가 업데이트될 때 각 question을 자동으로 분석
  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach((question) => {
        fetchTokenizedResults(question.question, question.questionListId);
      });
    }
  }, [questions]);

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="home-container">
      <h1>Question List with Tokens</h1>
      {questions.length > 0 ? (
        <div className="question-list">
          <ul>
            {questions.map((question) => (
              <li key={question.questionListId} className="question-item">
                <strong>Stage Level:</strong> {question.stageLevel}<br />
                <strong>Question:</strong> {question.question}<br />
                <strong>Result:</strong> {question.result}<br />
                <strong>Type:</strong> {question.type}
                {tokenResults[question.questionListId] && (
                  <div className="token-result">
                    <h2>Tokens:</h2>
                    <ul>
                      {tokenResults[question.questionListId].map((token, index) => (
                        <li key={index}>{token}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <hr className="divider" /> {/* 구분선 추가 */}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
}

export default Wordtest;
