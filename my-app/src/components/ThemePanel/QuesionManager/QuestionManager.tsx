import React, { useState } from 'react';
import axios from 'axios';

interface ImageData {
  word: string;
  imageUrl: string;
}

interface BlankQuestionData {
  sentence: string;
  answer: string;
  wrongOptions: string[];
  stageLevel: string;
}

const QuestionManager: React.FC = () => {
  // 이미지 생성 관련 상태
  const [word1, setWord1] = useState('');
  const [word2, setWord2] = useState('');
  const [word3, setWord3] = useState('');
  const [stageLevel, setStageLevel] = useState('');
  const [images, setImages] = useState<ImageData[]>([]);

  // Blank 문제 관련 상태
  const [blankSentence, setBlankSentence] = useState('');
  const [blankAnswer, setBlankAnswer] = useState('');
  const [blankStageLevel, setBlankStageLevel] = useState('');
  const [generatedBlankQuestion, setGeneratedBlankQuestion] = useState<BlankQuestionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 이미지 생성 핸들러
  const handleGenerateImages = async () => {
    const words = `${word1},${word2},${word3}`;
    try {
      const response = await axios.post('http://localhost:9999/api/question-manager/generate-images', null, {
        params: { words, stageLevel }
      });
      setImages(response.data);
      setError(null);
    } catch (err) {
      console.error("이미지 생성 오류:", err);
      setError('이미지 생성 중 오류가 발생했습니다.');
    }
  };

  // Blank 문제 생성 핸들러
  const handleGenerateBlankQuestion = async () => {
    try {
      const response = await axios.post<BlankQuestionData>(
        'http://localhost:9999/api/question-manager/generate-blank-options',
        null,
        {
          params: {
            sentence: blankSentence,
            answer: blankAnswer,
            stageLevel: blankStageLevel
          }
        }
      );

      setGeneratedBlankQuestion(response.data);
      setError(null);
    } catch (err) {
      console.error("문제 생성 오류:", err);
      setError('문제 생성 중 오류가 발생했습니다.');
    }
  };

  // Blank 문제 저장 핸들러
  const handleSaveBlankQuestion = async () => {
    if (!generatedBlankQuestion) {
      setError('먼저 문제를 생성해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:9999/api/question-manager/save-blank-question', {
        sentence: blankSentence,
        answer: blankAnswer,
        wrongOptions: generatedBlankQuestion.wrongOptions,
        stageLevel: blankStageLevel,
        type: "blank"
      });

      if (response.status === 200) {
        alert('문제가 성공적으로 저장되었습니다.');
        // 입력 필드 초기화
        setBlankSentence('');
        setBlankAnswer('');
        setBlankStageLevel('');
        setGeneratedBlankQuestion(null);
      }
    } catch (err) {
      console.error("문제 저장 오류:", err);
      setError('문제 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 이미지 생성 섹션 */}
      <div style={{ marginBottom: '40px' }}>
        <h2>이미지 문제 생성</h2>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input value={word1} onChange={(e) => setWord1(e.target.value)} placeholder="단어 1" />
          <input value={word2} onChange={(e) => setWord2(e.target.value)} placeholder="단어 2" />
          <input value={word3} onChange={(e) => setWord3(e.target.value)} placeholder="단어 3" />
          <input value={stageLevel} onChange={(e) => setStageLevel(e.target.value)} placeholder="스테이지 레벨" />
          <button onClick={handleGenerateImages}>이미지 생성</button>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {images.map((image, index) => (
            <div key={index}>
              <p>{image.word}</p>
              <img
                src={`http://localhost:9999${image.imageUrl}`}
                alt={image.word}
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blank 문제 생성 섹션 */}
      <div>
        <h2>Blank 문제 생성</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '500px' }}>
          <input
            value={blankSentence}
            onChange={(e) => setBlankSentence(e.target.value)}
            placeholder="문장을 입력하세요"
            style={{ padding: '8px' }}
          />
          <input
            value={blankAnswer}
            onChange={(e) => setBlankAnswer(e.target.value)}
            placeholder="정답 단어"
            style={{ padding: '8px' }}
          />
          <input
            value={blankStageLevel}
            onChange={(e) => setBlankStageLevel(e.target.value)}
            placeholder="스테이지 레벨"
            style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleGenerateBlankQuestion}
              disabled={!blankSentence || !blankAnswer || !blankStageLevel}
              style={{ padding: '8px', flex: 1 }}
            >
              문제 생성하기
            </button>
            <button
              onClick={handleSaveBlankQuestion}
              disabled={!generatedBlankQuestion}
              style={{
                padding: '8px',
                flex: 1,
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: generatedBlankQuestion ? 'pointer' : 'not-allowed',
                opacity: generatedBlankQuestion ? 1 : 0.6
              }}
            >
              문제 저장하기
            </button>
          </div>
        </div>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        {/* 생성된 문제 표시 */}
        {generatedBlankQuestion && (
          <div style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3>생성된 문제</h3>
            <p><strong>문장:</strong> {generatedBlankQuestion.sentence}</p>
            <p><strong>정답:</strong> {generatedBlankQuestion.answer}</p>
            <p><strong>스테이지 레벨:</strong> {generatedBlankQuestion.stageLevel}</p>
            <div>
              <strong>오답:</strong>
              <ul>
                {generatedBlankQuestion.wrongOptions.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionManager;