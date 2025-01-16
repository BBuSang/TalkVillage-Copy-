import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DictionaryData, Example, Meaning, Definition } from '../Dictionary/DictionaryData';
import './Resultmain.css';
import plus from '../../image/Dictionary/plus.png';
import arrow from '../../image/Dictionary/arrow.png';
import speaker from '../../image/Dictionary/speaker.png';

const Resultmain: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchWord = searchParams.get('word');
  const [data, setData] = useState<DictionaryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState<number>(5);

  useEffect(() => {
    if (searchWord) {
      fetchDictionaryData(searchWord);
    } else {
      setError('검색어가 없습니다. 단어를 검색해주세요.');
      setLoading(false);
    }
  }, [searchWord]);

  const fetchDictionaryData = async (word: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9999/define?word=${encodeURIComponent(word)}`);
      if (!response.ok) throw new Error('데이터를 불러오는데 실패했습니다.');
      const rawData = await response.json();
      setData(transformData(rawData));
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const transformData = (backendData: any): DictionaryData => {
    // 품사별로 그룹화
    const meaningsByPos = backendData.meanings?.reduce((acc: any, curr: any) => {
      if (!acc[curr.partOfSpeech]) {
        acc[curr.partOfSpeech] = [];
      }
      acc[curr.partOfSpeech].push(curr);
      return acc;
    }, {});

    const transformedMeanings = Object.entries(meaningsByPos || {}).map(([pos, defs]: [string, any]) => ({
      partOfSpeech: pos,
      definitions: defs.map((def: any) => ({
        order: def.order,
        meaning: def.meaning,
        type: def.type
      }))
    }));

    return {
      word: backendData.word || '',
      pronunciation: backendData.pronunciation || '',
      meanings: transformedMeanings,
      relatedWords: {
        synonyms: Array.isArray(backendData.synonyms) 
          ? backendData.synonyms.map((syn: string) => ({ word: syn, meaning: '' }))
          : []
      },
      idioms: Array.isArray(backendData.idioms)
        ? backendData.idioms.map((idiom: any) => ({
            type: 'idiom',
            phrase: typeof idiom === 'string' ? idiom : idiom.phrase || '',
            meaning: typeof idiom === 'string' ? '' : idiom.meaning || ''
          }))
        : [],
      examples: Array.isArray(backendData.examples)
        ? backendData.examples.map((example: any) => ({
            text: typeof example === 'string' ? example : example.text || ''
          }))
        : []
    };
  };

  const highlightWord = (text: string, word: string) => {
    const regex = new RegExp(`(${word})`, 'gi');
    return text.split(regex).map((part, index) => 
      part.toLowerCase() === word.toLowerCase() 
        ? <span key={index} className='highlight'>{part}</span> 
        : part
    );
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">에러: {error}</div>;
  if (!data) return <div className="no-data">데이터가 없습니다.</div>;

  return (
    <div className="result-wrapper">
      <div className="subtop">
        <div className="innertop">
          <div className="textbox">
            <div className='text'>
              {data.word}
              {data.pronunciation && (
                <span className="pronunciation">
                  {data.pronunciation}
                </span>
              )}
            </div>
            <div className="answer">
              {data.meanings[0]?.definitions[0]?.meaning}
            </div>
          </div>
          <div className="button-group">
            <button className='up'>
              <div className='button-text'>
                <div className='text-up'>바로저장</div>
                <img src={plus} className='plus' alt="저장"/>
              </div>
            </button>
            <button className='down'>
              <div className='button-text'>
                <div className='text-up'>단어장</div>
                <img src={plus} className='plus' alt="단어장"/>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="subbottom">
        <div className="innerbottom">
          <div className="left">
            {/* 뜻/문법 섹션 */}
            <div className="one">
              <div className='card-title'>뜻/문법</div>
              <div className='one-box'>
                {data.meanings.map((meaning: Meaning, mIndex: number) => (
                  <div key={mIndex} className='one-box-text'>
                    <div className='main-noun'>
                      <div className='title'>{meaning.partOfSpeech}</div>
                    </div>
                    {meaning.definitions.map((def: Definition, dIndex: number) => (
                      <div key={dIndex} className='noun-one'>
                        <div className='number-one'>({def.order})</div>
                        <div className='number-one-answer'>{def.meaning}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* 관련어 섹션 */}
            <div className="two">
              <div className='card-title'>관련어</div>
              <div className='two-box'>
                <div className='one-box-text'>
                  <div className='main-noun'>
                    <div className='title'>유의어</div>
                  </div>
                  {data.relatedWords.synonyms.map((synonym, index) => (
                    <div key={index} className='two-text'>
                      <div className='two-text-answer-title'>{synonym.word}</div>
                      <div className='two-text-answer'>{synonym.meaning}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 관용구/속담 섹션 */}
            <div className="three">
              <div className='card-title'>관용구/속담</div>
              <div className='three-box'>
                {data.idioms.map((item, index) => (
                  <div key={index} className='one-box-text'>
                    <div className='main-noun'>
                      <div className='title'>{item.type}</div>
                    </div>
                    <div className='two-text'>
                      <div className='two-text-answer-title'>{item.phrase}</div>
                      <div className='two-text-answer'>{item.meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 예문 섹션 */}
          <div className="right">
            <div className="four">
              <div className='card-title'>예문</div>
              <div className='four-box'>
                <div className='one-box-text-two'>
                  <div className='two-text'>
                    {data.examples.slice(0, displayCount).map((example: Example, index: number) => (
                      <div key={index} className='Exam'>
                        {highlightWord(example.text, data.word)}
                      </div>
                    ))}
                  </div>
                </div>
                {data.examples.length > displayCount && (
                  <div className='down-button'>
                    <button 
                      className='arrow-button' 
                      onClick={() => setDisplayCount(prev => prev + 5)}
                    >
                      <img src={arrow} className='arrow' alt="더보기"/>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resultmain;