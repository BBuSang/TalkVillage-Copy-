import React, { useState } from 'react';
import styles from './TranslationPanel.module.css';
import copyIcon from '../../../../image/Dictionary/copy.png';
import soundIcon from '../../../../image/Dictionary/sound.png';

const TranslationPanel: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('한국어');
    const [isPlaying, setIsPlaying] = useState(false);
    const targetLang = sourceLang === '한국어' ? '영어' : '한국어';

    const handleTranslate = async () => {
        try {
            const response = await fetch('http://localhost:9999/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: inputText,
                    target_lang: sourceLang === '한국어' ? 'EN' : 'KO'
                })
            });

            if (!response.ok) { 
                throw new Error('번역 요청 실패');
            }

            const data = await response.json();
            const cleanedText = data.translatedText
                .replace(/^"|"$/g, '')  // 앞뒤 따옴표 제거
                .replace(/\\n/g, '\n'); // \n을 실제 줄바꿈으로 변환
            setTranslatedText(cleanedText);
        } catch (error) {
            console.error('번역 오류:', error);
            alert('번역 중 오류가 발생했습니다.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
    };

    const handleLanguageSwitch = () => {
        setSourceLang(prevLang => (prevLang === '한국어' ? '영어' : '한국어'));
        setInputText(translatedText);
        setTranslatedText('');
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('복사되었습니다.');
    };

    const handleSpeak = async (text: string, lang: string) => {
        if (!text || isPlaying) return;
        
        try {
            setIsPlaying(true);
            const response = await fetch('http://localhost:9999/api/tts/synthesize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text,
                    lang: lang === '한국어' ? 'ko-KR' : 'en-US'
                })
            });

            if (!response.ok) {
                throw new Error('발음 재생에 실패했습니다.');
            }

            const data = await response.json();
            const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);

            audio.onended = () => {
                setIsPlaying(false);
            };

            audio.onerror = () => {
                setIsPlaying(false);
                alert('발음 재생에 실패했습니다.');
            };

            await audio.play();

        } catch (error) {
            console.error('TTS 오류:', error);
            alert('발음 재생 중 오류가 발생했습니다.');
            setIsPlaying(false);
        }
    };

    return (
        <div className={styles.translationContainer} style={{ marginBottom: '300px' }}>
            <div className={styles.languageSelectContainer}>
                <span>{sourceLang}</span>
                <button className={styles.languageSwitchButton} onClick={handleLanguageSwitch}>
                    ⇄
                </button>
                <span>{targetLang}</span>
            </div>
            <div className={styles.translationTextareaContainer}>
                <div className={styles.inputContainer}>
                    <textarea
                        placeholder="번역할 내용을 입력해 주세요."
                        value={inputText}
                        onChange={handleInputChange}
                        className={styles.inputText}
                    />
                    <div className={styles.leftButtons}>
                        <button 
                            onClick={() => handleSpeak(inputText, sourceLang)} 
                            className={`${styles.iconButton} ${!inputText.trim() || isPlaying ? styles.disabled : ''}`}
                            disabled={!inputText.trim() || isPlaying}
                        >
                            <img 
                                src={soundIcon} 
                                alt="소리내기" 
                                style={{ opacity: !inputText.trim() || isPlaying ? 0.5 : 1 }}
                            />
                        </button>
                        <button 
                            onClick={() => handleCopy(inputText)} 
                            className={`${styles.iconButton} ${!inputText.trim() ? styles.disabled : ''}`}
                            disabled={!inputText.trim()}
                        >
                            <img 
                                src={copyIcon} 
                                alt="복사하기" 
                                style={{ opacity: !inputText.trim() ? 0.5 : 1 }}
                            />
                        </button>
                        <button 
                            onClick={handleTranslate} 
                            className={`${styles.translateButton} ${!inputText.trim() ? styles.disabled : ''}`}
                            disabled={!inputText.trim()}
                        >
                            번역하기
                        </button>
                    </div>
                </div>
                <div className={styles.outputContainer}>
                    <textarea
                        placeholder="번역 결과"
                        value={translatedText}
                        readOnly
                        className={styles.outputText}
                    />
                    <div className={styles.rightButtons}>
                        <button 
                            onClick={() => handleSpeak(translatedText, targetLang)} 
                            className={`${styles.iconButton} ${!translatedText.trim() || isPlaying ? styles.disabled : ''}`}
                            disabled={!translatedText.trim() || isPlaying}
                        >
                            <img 
                                src={soundIcon} 
                                alt="소리내기" 
                                style={{ opacity: !translatedText.trim() || isPlaying ? 0.5 : 1 }}
                            />
                        </button>
                        <button 
                            onClick={() => handleCopy(translatedText)} 
                            className={`${styles.iconButton} ${!translatedText.trim() ? styles.disabled : ''}`}
                            disabled={!translatedText.trim()}
                        >
                            <img 
                                src={copyIcon} 
                                alt="복사하기" 
                                style={{ opacity: !translatedText.trim() ? 0.5 : 1 }}
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationPanel;