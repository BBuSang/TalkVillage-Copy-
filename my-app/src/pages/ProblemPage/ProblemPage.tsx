import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProblemPage = () => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0); // 현재 문제 인덱스
  const [userAnswer, setUserAnswer] = useState<number>(0); // 사용자가 입력한 답
  const [completed, setCompleted] = useState(false); // 문제 완료 여부
  const navigate = useNavigate(); // React Router v6의 useNavigate 훅 사용

  const problems = [
    { question: '5 + 3', answer: 8 },
    { question: '7 - 4', answer: 3 },
   
  ];

  const handleProblemSubmit = () => {
    if (userAnswer === problems[currentProblemIndex].answer) {
      if (currentProblemIndex === problems.length - 1) {
        setCompleted(true); // 마지막 문제를 풀었을 때 팝업 표시
      } else {
        setCurrentProblemIndex(currentProblemIndex + 1); // 다음 문제로 이동
        setUserAnswer(0); // 답 초기화
      }
    } else {
      alert('틀렸습니다. 다시 시도하세요!');
    }
  };

  const handlePopupClose = () => {
    alert('모든 문제를 완료했습니다!');
    navigate('/MainMap/BeginnerStudyMap'); // MainMap 페이지로 리디렉션
  };

  return (
    <div>
      <h2>문제 {currentProblemIndex + 1}</h2>
      <p>{problems[currentProblemIndex].question}</p>
      <input
        type="number"
        value={userAnswer}
        onChange={(e) => setUserAnswer(Number(e.target.value))}
        placeholder="정답을 입력하세요"
      />
      <button onClick={handleProblemSubmit}>다음</button>

      {completed && (
        <div>
          <p>모든 문제를 완료했습니다!</p>
          <button onClick={handlePopupClose}>완료</button>
        </div>
      )}
    </div>
  );
};

export default ProblemPage;
