import React, { useState, useEffect } from 'react';
import styles from './AddScrambledWord.module.css';
import { useNavigate } from 'react-router-dom';

interface WordEntry {
    id: number;
    word: string;
    hint: string;
}

const AddScrambledWord: React.FC = () => {
    const [entries, setEntries] = useState<WordEntry[]>([]); // 기존 단어 목록
    const [newWord, setNewWord] = useState<string>(''); // 새 단어 입력
    const [newHint, setNewHint] = useState<string>(''); // 새 힌트 입력
    const [fileName, setFileName] = useState<string | null>(null); // 선택된 파일 이름 상태
    const [file, setFile] = useState<File | null>(null); // 선택된 파일 상태
    const navigate = useNavigate();

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/ScrambledWord/list');
            if (response.ok) {
                const data = await response.json();
                setEntries(data);
            } else {
                console.error('단어 목록을 가져오는데 실패했습니다.');
            }
        } catch (error) {
            console.error('단어 목록 가져오기 오류:', error);
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

            const response = await fetch('http://localhost:9999/api/ScrambledWord/upload-csv', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                setEntries(prevEntries => [...prevEntries, ...result]);
                alert('단어가 성공적으로 추가되었습니다.');
            } else {
                const errorData = await response.text();
                alert(errorData || 'CSV 파일 업로드에 실패했습니다.');
            }
        } catch (error) {
            console.error('파일 업로드 중 에러:', error);
            alert('파일 업로드 중 오류가 발생했습니다.');
        }

        // input 요소 초기화
        if (event.target) {
          event.target.value = '';
        }
    };

    const handleDeleteWord = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:9999/api/ScrambledWord/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setEntries(entries.filter((entry) => entry.id !== id));
            } else {
                console.error('단어 삭제 실패');
            }
        } catch (error) {
            console.error('단어 삭제 중 에러:', error);
        }
    };

    const handleAddWords = async () => {
        if (!newWord || !newHint) {
            alert('단어와 힌트를 모두 입력해주세요.');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:9999/api/ScrambledWord/addwords', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([{
                    word: newWord.trim(),
                    hint: newHint.trim()
                }]),
            });
    
            if (response.ok) {
                // 서버에서 정상적으로 추가된 단어 목록 반환
                const result = await response.json();
                setEntries(prevEntries => [...prevEntries, ...result]); // 새로 추가된 단어들을 기존 목록에 추가
                setNewWord(''); // 입력 초기화
                setNewHint(''); // 입력 초기화
                alert('단어가 성공적으로 추가되었습니다.');
            } else {
                // JSON이 아닌 텍스트 응답을 받았을 경우 처리
                const errorText = await response.text();
                alert(errorText || '단어 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('단어 추가 중 오류:', error);
        }
    };
    
    

    const handleFileInputClick = () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.click(); // 파일 선택 input 클릭
        }
    };

    // 엔터로 단어 추가
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAddWords();
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h3 className={styles.title}>단어 목록</h3>
                <div className={styles.wordList}>
                    {entries.map((entry) => (
                        <div key={entry.id} className={styles.wordItem}>
                            <span><strong>단어:</strong> {entry.word}, <strong>힌트:</strong> {entry.hint}</span>
                            <button onClick={() => handleDeleteWord(entry.id)} className={styles.deleteButton}>
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.rightPanel}>
                <h3 className={styles.title}>단어 추가</h3>
                <div className={styles.inputForm}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="단어"
                            className={styles.input}
                            onKeyDown={handleKeyDown} // 엔터로 단어 추가
                        />
                        <input
                            type="text"
                            value={newHint}
                            onChange={(e) => setNewHint(e.target.value)}
                            placeholder="힌트"
                            className={styles.input}
                            onKeyDown={handleKeyDown} // 엔터로 단어 추가
                        />
                        <button onClick={handleAddWords} className={styles.addButton}>
                            추가
                        </button>
                    </div>
                </div>

                <h3 className={styles.title}>CSV 파일로 단어 추가</h3>
                <div
                    className={styles.uploadContainer}
                    onDrop={(e) => e.preventDefault()}
                    onDragOver={(e) => e.preventDefault()}
                >
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
                    <button onClick={handleFileInputClick} className={styles.uploadButton}>
                        파일 업로드
                    </button>
                    <p className={styles.helpText}>
                        CSV 파일 첫줄 형식: word,hint<br />
                        예시: banana,원숭이가 좋아하는 노란 과일<br />
                        파일 저장시 UTF-8 설정 필수<br />
                        단어 4글자 이상
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddScrambledWord;
