import React, { useState, useEffect } from 'react';
import styles from './AddCrossWordAdmin.module.css';

interface CrossWordGameWord {
  id: number;
  word: string;
  description: string;
}

function CrossWordAdmin() {
  const [words, setWords] = useState<CrossWordGameWord[]>([]);
  const [wordForm, setWordForm] = useState<Omit<CrossWordGameWord, 'id'>>({
    word: '',
    description: ''
  });
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch('http://localhost:9999/api/puzzle/words');
      if (response.ok) {
        const data = await response.json();
        setWords(data);
      }
    } catch (error) {
      console.error('단어 목록 가져오기 오류:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!/^[a-zA-Z]+$/.test(wordForm.word)) {
        alert('단어는 영문자만 입력 가능합니다.');
        return;
      }

      const response = await fetch('http://localhost:9999/api/puzzle/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: wordForm.word.toLowerCase(),
          description: wordForm.description
        })
      });

      if (response.ok) {
        setWordForm({ word: '', description: '' });
        fetchWords(); // 목록 새로고침
      } else {
        const errorData = await response.json();
        alert(`단어 추가 실패: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('단어 추가 중 오류가 발생했습니다.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:9999/api/puzzle/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const validWords = result.filter((word: CrossWordGameWord) => 
          word.word.length <= 10 && word.description.length <= 60
        );
        
        if (validWords.length !== result.length) {
          alert('일부 단어가 길이 제한을 초과하여 제외되었습니다.\n단어: 최대 10자, 설명: 최대 60자');
        }
        
        setWords(prevWords => [...prevWords, ...validWords]);
        alert('단어가 성공적으로 추가되었습니다.');
        fetchWords();
      } else {
        const errorData = await response.text();
        alert(errorData || 'CSV 파일 업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('파일 업로드 중 에러:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const handleDeleteWord = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:9999/api/puzzle/words/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setWords(words.filter(word => word.id !== id));
        fetchWords();
        
      } else {
        alert('단어 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('단어 삭제 중 에러:', error);
      alert('단어 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <h3>단어 목록</h3>
        <div className={styles.wordList}>
          {words.map((word) => (
            <div key={word.id} className={styles.wordItem}>
              <div className={styles.wordInfo}>
                <strong>{word.word}</strong>
                <p>{word.description}</p>
              </div>
              <button
                onClick={() => handleDeleteWord(word.id)}
                className={styles.deleteButton}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rightPanel}>
        <div className={styles.addWordSection}>
          <h3>단어 직접 추가</h3>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={wordForm.word}
                onChange={(e) => setWordForm({ ...wordForm, word: e.target.value })}
                placeholder="영단어 (최대 10자)"
                required
                maxLength={10}
                pattern="[a-zA-Z]+"
              />
            </div>
            <div className={styles.inputGroup}>
              <textarea
                value={wordForm.description}
                onChange={(e) => setWordForm({ ...wordForm, description: e.target.value })}
                placeholder="설명 (최대 60자)"
                required
                maxLength={60}
                rows={3}
              />
              <span className={styles.charCount}>
                {wordForm.description.length}/60
              </span>
            </div>
            <button type="submit" className={styles.submitButton}>
              추가하기
            </button>
          </form>
        </div>

        <div className={styles.uploadSection}>
          <h3>CSV 파일로 추가</h3>
          <div className={styles.uploadContainer}>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="file-upload"
            />
            <label htmlFor="file-upload" className={styles.fileLabel}>
              {fileName ? `선택된 파일: ${fileName}` : '파일 선택'}
            </label>
            <p className={styles.helpText}>
              CSV 파일 형식: word,description<br />
              예시: apple,사과<br />
              파일 저장시 UTF-8 설정 필수
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CrossWordAdmin; 