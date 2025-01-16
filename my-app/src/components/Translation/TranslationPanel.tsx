import React, { useState } from 'react';
import './TranslationPanel.css';
import copyIcon from '../../image/Dictionary/copy.png';
import soundIcon from '../../image/Dictionary/sound.png';

const TranslationPanel: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('한국어');
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

            const translatedText = await response.text();
            setTranslatedText(translatedText);
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

    const handleSpeak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = sourceLang === '한국어' ? 'ko-KR' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="translation-container" style={{ marginBottom: '300px' }}>
            <div className="language-select-container">
                <span>{sourceLang}</span>
                <button className="language-switch-button" onClick={handleLanguageSwitch}>
                    ⇄
                </button>
                <span>{targetLang}</span>
            </div>
            <div className="translation-textarea-container">
                <div className="input-container">
                    <textarea
                        placeholder="번역할 내용을 입력해 주세요."
                        value={inputText}
                        onChange={handleInputChange}
                        className="input-text"
                    />
                    <div className="left-buttons">
                        <button onClick={() => handleSpeak(inputText)} className="icon-button speak-button">
                            <img src={soundIcon} alt="소리내기" />
                        </button>
                        <button onClick={() => handleCopy(inputText)} className="icon-button copy-button">
                            <img src={copyIcon} alt="복사하기" />
                        </button>
                        <button onClick={handleTranslate} className="translate-button">번역하기</button>
                    </div>
                </div>
                <div className="output-container">
                    <textarea
                        placeholder="번역 결과"
                        value={translatedText}
                        readOnly
                        className="output-text"
                    />
                    <div className="right-buttons">
                        <button onClick={() => handleSpeak(translatedText)} className="icon-button speak-button">
                            <img src={soundIcon} alt="소리내기" />
                        </button>
                        <button onClick={() => handleCopy(translatedText)} className="icon-button copy-button">
                            <img src={copyIcon} alt="복사하기" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationPanel;