import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FileUploadAndView.module.css';

interface CsvData {
    stageLevel: string;
    question: string;
    result: string;
    wrongData: string;
    type: string;
}

const generateWrongData = (result: string): string => {
    if (!result) return '';

    const words = result.split(',').map(word => word.trim());
    
    const wrongWords = words.map(word => {
        if (word.length >= 3) {
            const randomIndex = Math.floor(Math.random() * word.length);
            const chars = word.split('');
            const randomChar = String.fromCharCode(
                97 + Math.floor(Math.random() * 26)
            );
            chars[randomIndex] = randomChar;
            return chars.join('');
        }
        return word + 's';
    });

    return wrongWords.join(',');
};

const FileUploadAndView: React.FC = () => {
    const [csvData, setCsvData] = useState<{[key: string]: CsvData[]}>({});
    const [sheets, setSheets] = useState<string[]>([]);
    const [activeSheet, setActiveSheet] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [generatingWrongData, setGeneratingWrongData] = useState<boolean>(false);
    const [savingToDatabase, setSavingToDatabase] = useState<boolean>(false);
    const [syncing, setSyncing] = useState<boolean>(false);
    
    useEffect(() => {
        handleLoadExcelData();
    }, []);

    const handleLoadExcelData = async () => {
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('http://localhost:9999/api/files/convert');
            
            if (!response.ok) {
                throw new Error('파일 변환 실패');
            }

            const result = await response.json();
            const sheetNames = result.sheets;
            setSheets(sheetNames);
            
            if (sheetNames.length > 0) {
                setActiveSheet(sheetNames[0]);
                await loadCsvData(sheetNames);
            }
            
        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };
    
    const loadCsvData = async (sheetNames: string[]) => {
        try {
            const data: {[key: string]: CsvData[]} = {};
            
            for (const sheet of sheetNames) {
                const response = await fetch(`http://localhost:9999/api/files/csv/${sheet}`);
                if (!response.ok) {
                    throw new Error(`${sheet} 데이터 로드 실패`);
                }
                data[sheet] = await response.json();
            }
            
            setCsvData(data);
            
        } catch (err) {
            setError(err instanceof Error ? err.message : '데이터 로드 실패');
        }
    };

    const handleSync = async () => {
        setSyncing(true);
        setError('');
        
        try {
            const syncResponse = await axios.post('http://localhost:9999/api/files/sync', null, {
                params: { fileName: 'TalkVillageQuestions.xlsx' }
            });
            
            if (syncResponse.status === 200) {
                const currentSheet = activeSheet;
                const newSheets = syncResponse.data.sheets;
                setSheets(newSheets);
                
                await loadCsvData(newSheets);
                
                if (newSheets.includes(currentSheet)) {
                    setActiveSheet(currentSheet);
                } else if (newSheets.length > 0) {
                    setActiveSheet(newSheets[0]);
                }
                
                window.alert('엑셀 파일이 성공적으로 동기화되었습니다.');
            }
        } catch (err) {
            console.error('Sync error:', err);
            setError(err instanceof Error ? err.message : '동기화 중 오류가 발생했습니다.');
        } finally {
            setSyncing(false);
        }
    };

    const handleGenerateWrongData = async () => {
        if (!activeSheet) return;
        
        setGeneratingWrongData(true);
        try {
            const currentData = csvData[activeSheet];
            const updatedData = currentData.map(row => ({
                ...row,
                wrongData: row.wrongData || generateWrongData(row.result)
            }));
            
            const response = await axios.post(
                `http://localhost:9999/api/files/update-wrong-data?sheetName=${activeSheet}`,
                updatedData
            );

            if (response.status === 200) {
                setCsvData({
                    ...csvData,
                    [activeSheet]: updatedData
                });
                window.alert('오답이 성공적으로 생성되고 엑셀에 저장되었습니다.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '오답 생성 및 저장 중 오류 발생');
        } finally {
            setGeneratingWrongData(false);
        }
    };

    const handleSaveToDatabase = async () => {
        if (!window.confirm('모든 데이터를 데이터베이스에 저장하시겠습니까?')) {
            return;
        }

        setSavingToDatabase(true);
        try {
            const response = await axios.post('http://localhost:9999/api/files/save-to-database');
            if (response.status === 200) {
                window.alert('모든 데이터가 성공적으로 데이터베이스에 저장되었습니다.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '데이터베이스 저장 중 오류 발생');
        } finally {
            setSavingToDatabase(false);
        }
    };
    
    return (
        <div className={styles.fileUploadContainer}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            {loading && <div className={styles.loadingMessage}>데이터 로딩 중...</div>}
            
            {Object.keys(csvData).length > 0 && (
                <div className={styles.dataViewSection}>
                    <div className={styles.tabs}>
                        {sheets.map(sheet => (
                            <button
                                key={sheet}
                                className={`${styles.tabButton} ${activeSheet === sheet ? styles.active : ''}`}
                                onClick={() => setActiveSheet(sheet)}
                            >
                                {sheet}
                            </button>
                        ))}
                    </div>

                    <div className={styles.actionButtons}>
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className={`${styles.actionButton} ${styles.sync}`}
                        >
                            {syncing ? '동기화 중...' : '엑셀 동기화'}
                        </button>

                        <button
                            onClick={handleGenerateWrongData}
                            disabled={generatingWrongData}
                            className={styles.actionButton}
                        >
                            {generatingWrongData ? '오답 생성 중...' : 'Blank 문제 오답 생성'}
                        </button>
                        
                        <button
                            onClick={handleSaveToDatabase}
                            disabled={savingToDatabase}
                            className={styles.actionButton}
                        >
                            {savingToDatabase ? '저장 중...' : '전체 데이터 DB 저장'}
                        </button>
                    </div>
                    
                    <div className={styles.tableContainer}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Stage Level</th>
                                    <th>Question</th>
                                    <th>Result</th>
                                    <th>Wrong Data</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {csvData[activeSheet]?.map((row: CsvData, index) => (
                                    <tr key={index}>
                                        <td>{row.stageLevel}</td>
                                        <td>{row.question}</td>
                                        <td>{row.result}</td>
                                        <td>{row.wrongData}</td>
                                        <td>{row.type}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadAndView;