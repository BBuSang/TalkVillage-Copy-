import React, { useState, useEffect } from 'react';
import styles from './AddHangmanWord.module.css';
import { useNavigate } from 'react-router-dom';

interface WordEntry {
    id: number;
    category: string;
    word: string;
}

const AddHangmanWord: React.FC = () => {
    const [entries, setEntries] = useState<WordEntry[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newWord, setNewWord] = useState('');
    const [fileName, setFileName] = useState<string | null>(null); // 선택된 파일 이름 상태
    const [file, setFile] = useState<File | null>(null); // 선택된 파일 상태
    const navigate = useNavigate();

    useEffect(() => {
        fetchWords();
    }, []);

    const fetchWords = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/hangman/words');
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
        setFileName(selectedFile.name); // 파일 이름 상태 업데이트

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://localhost:9999/api/hangman/upload-csv', {
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
            const response = await fetch(`http://localhost:9999/api/hangman/words/${id}`, {
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

    const handleDirectAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newCategory.trim() || !newWord.trim()) {
            alert('카테고리와 단어를 모두 입력해주세요.');
            return;
        }

        try {
            const response = await fetch('http://localhost:9999/api/hangman/addwords', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{
                    category: newCategory.trim(),
                    word: newWord.trim()
                }])
            });

            if (response.ok) {
                const result = await response.json();
                setEntries(prevEntries => [...prevEntries, ...result]);
                setNewCategory('');
                setNewWord('');
                alert('단어가 성공적으로 추가되었습니다.');
            } else {
                const errorData = await response.text();
                alert(errorData || '단어 추가에 실패했습니다.');
            }
        } catch (error) {
            console.error('단어 추가 중 에러:', error);
            alert('단어 추가 중 오류가 발생했습니다.');
        }
    };

    // 드래그 앤 드롭 이벤트 처리
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        if (droppedFile) {
            setFileName(droppedFile.name);
            setFile(droppedFile);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleFileInputClick = () => {
        // file input 요소를 클릭할 때 이벤트 핸들러 호출
        if (file) {
            const fileInputEvent = {
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>;

            handleFileUpload(fileInputEvent);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftPanel}>
                <h3 className={styles.title}>단어 목록</h3>
                <div className={styles.wordList}>
                    {entries.map((entry) => (
                        <div key={entry.id} className={styles.wordItem}>
                            <span><strong>카테고리:</strong> {entry.category}, <strong>단어:</strong>{entry.word}</span>
                            <button
                                onClick={() => handleDeleteWord(entry.id)}
                                className={styles.deleteButton}
                            >
                                삭제
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={styles.rightPanel}>
                <h3 className={styles.title}>단어 추가</h3>
                
                <form onSubmit={handleDirectAdd} className={styles.inputForm}>
                    <div className={styles.inputGroup}>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="카테고리"
                            className={styles.input}
                        />
                        <input
                            type="text"
                            value={newWord}
                            onChange={(e) => setNewWord(e.target.value)}
                            placeholder="단어"
                            className={styles.input}
                        />
                        <button type="submit" className={styles.addButton}>
                            추가
                        </button>
                    </div>
                </form>

                <h3 className={styles.title}>CSV 파일로 단어 추가</h3>
                <div
                    className={styles.uploadContainer}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
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
                        CSV 파일 첫줄 형식: category,word<br />
                        예시: 동물,사자<br />
                        파일 저장시 UTF-8 설정 필수
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AddHangmanWord;
