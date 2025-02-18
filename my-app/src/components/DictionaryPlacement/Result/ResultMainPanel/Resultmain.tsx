import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResultmain } from '../hooks/ResultmainHook';
import { 
  Example, 
  Synonyms, 
  Definition, 
  Meaning,
  DictionaryData 
} from '../../Dictionary/DictionaryData';
import styles from './Resultmain.module.css';
import plus from '../../../../image/Dictionary/plus.png';
import arrow from '../../../../image/Dictionary/arrow.png';

const Resultmain: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const searchWord = searchParams.get('word');

    const {
        data,
        loading,
        error,
        meaningDisplayCount,
        setMeaningDisplayCount,
        synonymDisplayCount,
        setSynonymDisplayCount,
        idiomDisplayCount,
        setIdiomDisplayCount,
        exampleDisplayCount,
        setExampleDisplayCount,
        saveStatus,
        handleSaveWord
    } = useResultmain(searchWord);

    const handleGoToVocabulary = () => {
        navigate('/mainmap/voca');
    };

    const highlightWord = (text: string, word: string) => {
        const regex = new RegExp(`(${word})`, 'gi');
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === word.toLowerCase()
                ? <span key={index} className={styles.highlight}>{part}</span>
                : part
        );
    };

    if (loading) return <div className={styles.loading}>로딩 중...</div>;
    if (error) return <div className={styles.error}>에러: {error}</div>;
    if (!data) return <div className={styles.noData}>데이터가 없습니다.</div>;

    return (
        <div className={styles.resultWrapper}>
            <div className={styles.subtop}>
                <div className={styles.innertop}>
                    <div className={styles.textbox}>
                        <div className={styles.text}>
                            {data.word}
                            {data.pronunciation && (
                                <span className={styles.pronunciation}>
                                    {data.pronunciation}
                                </span>
                            )}
                        </div>
                        <div className={styles.answer}>
                            {data.koreanWord && (
                                <div className={styles.koreanWord}>
                                    {data.koreanWord}
                                </div>
                            )}
                            {data.meanings[0]?.definitions[0]?.meaning}
                            {data.meanings[0]?.definitions[0]?.koreanMeaning && (
                                <div className={styles.koreanMeaning}>
                                    {data.meanings[0]?.definitions[0]?.koreanMeaning}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.up}
                            onClick={handleSaveWord}
                        >
                            <div className={styles.buttonText}>
                                <div className={styles.textUp}>바로저장</div>
                                <img src={plus} className={styles.plus} alt="저장" />
                            </div>
                        </button>
                        <button
                            className={styles.down}
                            onClick={handleGoToVocabulary}
                        >
                            <div className={styles.buttonText}>
                                <div className={styles.textUp}>단어장</div>
                                <img src={plus} className={styles.plus} alt="단어장" />
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.subbottom}>
                <div className={styles.innerbottom}>
                    <div className={styles.left}>
                        <div className={styles.one}>
                            <div className={styles.cardTitle}>뜻/문법</div>
                            <div className={styles.oneBox}>
                                {Object.entries(
                                    data.meanings.reduce((acc: { [key: string]: Definition[] }, meaning: Meaning) => {
                                        if (!acc[meaning.partOfSpeech]) {
                                            acc[meaning.partOfSpeech] = [];
                                        }
                                        acc[meaning.partOfSpeech].push(...meaning.definitions);
                                        return acc;
                                    }, {})
                                ).map(([partOfSpeech, definitions]) => {
                                    const startIndex = data.meanings
                                        .flatMap(m => m.definitions)
                                        .findIndex(d => d === definitions[0]);
                                    const isVisible = startIndex < meaningDisplayCount;

                                    if (!isVisible) return null;

                                    return (
                                        <div key={partOfSpeech} className={styles.oneBoxText}>
                                            <div className={styles.mainNoun}>
                                                <div className={styles.title}>
                                                    {`${partOfSpeech}(${data.meanings.find(m => m.partOfSpeech === partOfSpeech)?.koreanPartOfSpeech})`}
                                                </div>
                                            </div>
                                            {definitions.map((def: Definition, dIndex: number) => {
                                                const globalIndex = startIndex + dIndex;
                                                if (globalIndex >= meaningDisplayCount) return null;

                                                return (
                                                    <div key={dIndex} className={styles.nounOne}>
                                                        <div className={styles.numberOne}>({def.order})</div>
                                                        <div className={styles.numberOneAnswer}>
                                                            <div className={styles.definitionHeader}>
                                                                {def.type && (
                                                                    <span className={styles.typeLabel}>
                                                                        {def.type}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={styles.englishMeaning}>{def.meaning}</div>
                                                            {def.koreanMeaning && (
                                                                <div className={styles.koreanMeaning}>{def.koreanMeaning}</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                                {data.meanings.flatMap(m => m.definitions).length > meaningDisplayCount && (
                                    <div className={styles.downButton}>
                                        <button
                                            className={styles.arrowButton}
                                            onClick={() => setMeaningDisplayCount(prev => prev + 5)}
                                        >
                                            <img src={arrow} className={styles.arrow} alt="더보기" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.two}>
                            <div className={styles.cardTitle}>관련어</div>
                            <div className={styles.twoBox}>
                                <div className={styles.oneBoxText}>
                                    <div className={styles.mainNoun}>
                                        <div className={styles.title}>synonym(유의어)</div>
                                    </div>
                                    <div className={styles.synonymList}>
                                        {data.synonyms?.slice(0, synonymDisplayCount).map((synonym: Synonyms, index: number) => (
                                            <div key={index} className={styles.twoText}>
                                                <div className={styles.twoTextAnswerTitle}>{synonym.word}</div>
                                                <div className={styles.twoTextAnswer}>
                                                    <div>{synonym.meaning}</div>
                                                    {synonym.koreanMeaning && (
                                                        <div className={styles.koreanMeaning}>{synonym.koreanMeaning}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {data.synonyms && data.synonyms.length > synonymDisplayCount && (
                                            <div className={styles.downButton}>
                                                <button
                                                    className={styles.arrowButton}
                                                    onClick={() => setSynonymDisplayCount(prev => prev + 5)}
                                                >
                                                    <img src={arrow} className={styles.arrow} alt="더보기" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.three}>
                            <div className={styles.cardTitle}>관용구/속담</div>
                            <div className={styles.threeBox}>
                                {Object.entries(
                                    data.idioms?.reduce((acc: { [key: string]: any[] }, idiom) => {
                                        const type = idiom.type || 'idiom(관용구)';
                                        if (!acc[type]) {
                                            acc[type] = [];
                                        }
                                        acc[type].push(idiom);
                                        return acc;
                                    }, {}) || {}
                                ).map(([type, idioms], index) => (
                                    <div key={index} className={styles.oneBoxText}>
                                        <div className={styles.mainNoun}>
                                            <div className={styles.title}>{type}</div>
                                        </div>
                                        {idioms.slice(0, idiomDisplayCount).map((item, idx) => (
                                            <div key={idx} className={styles.twoText}>
                                                <div className={styles.twoTextAnswerTitle}>{item.phrase}</div>
                                                <div className={styles.twoTextAnswer}>
                                                    {item.meaning && item.meaning !== item.phrase && (
                                                        <div>{item.meaning}</div>
                                                    )}
                                                    {item.koreanMeaning && (
                                                        <div className={styles.koreanMeaning}>{item.koreanMeaning}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {idioms.length > idiomDisplayCount && (
                                            <div className={styles.downButton}>
                                                <button
                                                    className={styles.arrowButton}
                                                    onClick={() => setIdiomDisplayCount(prev => prev + 5)}
                                                >
                                                    <img src={arrow} className={styles.arrow} alt="더보기" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.four}>
                            <div className={styles.cardTitle}>예문</div>
                            <div className={styles.fourBox}>
                                <div className={styles.oneBoxTextTwo}>
                                    <div className={styles.twoText}>
                                        {data.examples?.slice(0, exampleDisplayCount).map((example: Example, index: number) => (
                                            <div key={index} className={styles.Exam}>
                                                <div>{highlightWord(example.text, data.word)}</div>
                                                {example.koreanText && (
                                                    <div className={styles.koreanExample}>{example.koreanText}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {data.examples && data.examples.length > exampleDisplayCount && (
                                    <div className={styles.downButton}>
                                        <button
                                            className={styles.arrowButton}
                                            onClick={() => setExampleDisplayCount(prev => prev + 5)}
                                        >
                                            <img src={arrow} className={styles.arrow} alt="더보기" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {saveStatus && (
                <div className={styles.saveStatus}>
                    {saveStatus}
                </div>
            )}
        </div>
    );
};

export default Resultmain;