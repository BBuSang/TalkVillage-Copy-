import { useState, useEffect } from 'react';
import axios from 'axios';
import DictionaryApi from '../dictionaryApi';
import { DictionaryData, Example, Meaning, Definition, Synonyms } from '../../Dictionary/DictionaryData';

export const useResultmain = (searchWord: string | null) => {
    const [data, setData] = useState<DictionaryData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [meaningDisplayCount, setMeaningDisplayCount] = useState<number>(5);
    const [synonymDisplayCount, setSynonymDisplayCount] = useState<number>(5);
    const [idiomDisplayCount, setIdiomDisplayCount] = useState<number>(5);
    const [exampleDisplayCount, setExampleDisplayCount] = useState<number>(5);
    const [saveStatus, setSaveStatus] = useState<string>('');

    const fetchDictionaryData = async (word: string) => {
        try {
            setLoading(true);
            console.log('Fetching dictionary data for word:', word);
            const data = await DictionaryApi.fetchDictionaryData(word);
            console.log('Received data from API:', data);
            const processedData = await processData(data);
            setData(processedData);
        } catch (err) {
            console.error('Dictionary data fetch error:', err);
            setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const processData = async (data: any): Promise<DictionaryData> => {
        console.log('Processing data input:', data);

        if (data.koreanWord) {
            console.log('Using cached data with koreanWord:', data.koreanWord);
            return transformData(data);
        }

        const translatedData = { ...data };

        try {
            translatedData.koreanWord = await DictionaryApi.translateText(data.word);
            console.log('Word translation result:', translatedData.koreanWord);

            if (!data.meanings?.[0]?.definitions?.[0]?.koreanMeaning) {
                for (const meaning of translatedData.meanings || []) {
                    for (const def of meaning.definitions) {
                        if (def.meaning && !def.koreanMeaning) {
                            def.koreanMeaning = await DictionaryApi.translateText(def.meaning);
                        }
                    }
                }

                if (translatedData.examples) {
                    for (const example of translatedData.examples) {
                        if (example.text && !example.koreanText) {
                            example.koreanText = await DictionaryApi.translateText(example.text);
                        }
                    }
                }

                if (translatedData.idioms) {
                    for (const idiom of translatedData.idioms) {
                        if (idiom.phrase && !idiom.koreanMeaning) {
                            idiom.koreanMeaning = await DictionaryApi.translateText(idiom.phrase);
                        }
                    }
                }

                if (translatedData.synonyms) {
                    for (const synonym of translatedData.synonyms) {
                        if (synonym.meaning && !synonym.koreanMeaning) {
                            synonym.koreanMeaning = await DictionaryApi.translateText(synonym.meaning);
                        }
                    }
                }
            }

            await DictionaryApi.addWordToDictionary(data.word, translatedData);
            return transformData(translatedData);
        } catch (error) {
            console.error('Translation error:', error);
            return transformData(data);
        }
    };

    const handleSaveWord = async () => {
        if (!data) return;

        try {
            const response = await axios.post('http://localhost:9999/api/vocabulary', null, {
                params: {
                    wordEN: data.word,
                    wordKO: data.koreanWord || ''
                },
                withCredentials: true
            });

            if (response.status === 200) {
                setSaveStatus('단어장에 저장되었습니다.');
                setTimeout(() => setSaveStatus(''), 3000);
            }
        } catch (error) {
            console.error('Failed to save word:', error);
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                setSaveStatus('로그인이 필요합니다.');
            } else {
                setSaveStatus('저장에 실패했습니다. 다시 시도해주세요.');
            }
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const transformData = (backendData: any): DictionaryData => {
        const translatePartOfSpeech = (pos: string): string => {
            const posMap: { [key: string]: string } = {
                'noun': '명사',
                'verb': '동사',
                'adjective': '형용사',
                'adverb': '부사',
                'preposition': '전치사',
                'conjunction': '접속사',
                'interjection': '감탄사',
                'pronoun': '대명사',
                'article': '관사',
                'auxiliary verb': '조동사',
                'determiner': '한정사',
                'phrasal verb': '구동사',
                'noun phrase': '명사구',
                'idiom': '관용구'
            };
            return posMap[pos.toLowerCase()] || pos;
        };

        const translateType = (type: string): string => {
            if (!type) return '';

            if (type.toLowerCase() === 'basic meaning') {
                return 'basic meaning(기본의미)';
            }

            const typeMap: { [key: string]: string } = {
                'transitive': '타동사',
                'intransitive': '자동사',
                'countable': '가산명사',
                'uncountable': '불가산명사',
                'singular': '단수',
                'plural': '복수',
                'comparative': '비교급',
                'superlative': '최상급'
            };

            const koreanType = typeMap[type.toLowerCase()] || type;
            return `${type}(${koreanType})`;
        };

        const meaningsByPos = backendData.meanings.reduce((acc: { [key: string]: any[] }, meaning: any) => {
            if (!acc[meaning.partOfSpeech]) {
                acc[meaning.partOfSpeech] = [];
            }
            if (Array.isArray(meaning.definitions)) {
                acc[meaning.partOfSpeech].push(...meaning.definitions);
            }
            return acc;
        }, {});

        const transformedMeanings = Object.entries(meaningsByPos).map(([pos, definitions]) => ({
            partOfSpeech: pos,
            koreanPartOfSpeech: translatePartOfSpeech(pos),
            definitions: Array.isArray(definitions)
                ? definitions.map((def: any) => ({
                    order: def.order || 1,
                    meaning: def.meaning || '',
                    koreanMeaning: def.koreanMeaning || '',
                    type: def.type ? translateType(def.type) : 'basic meaning(기본의미)'
                }))
                : []
        }));

        return {
            word: backendData.word || '',
            koreanWord: backendData.koreanWord || '',
            pronunciation: backendData.pronunciation || '',
            meanings: transformedMeanings,
            synonyms: Array.isArray(backendData.synonyms)
                ? backendData.synonyms.map((syn: any) => ({
                    word: syn.word || syn || '',
                    meaning: syn.meaning || '',
                    koreanMeaning: syn.koreanMeaning || ''
                }))
                : [],
            idioms: Array.isArray(backendData.idioms)
                ? backendData.idioms.map((idiom: any) => ({
                    type: idiom.type === 'idiom' ? 'idiom(관용구)' : 'proverb(속담)',
                    phrase: idiom.phrase || '',
                    meaning: idiom.meaning || '',
                    koreanMeaning: idiom.koreanMeaning || ''
                }))
                : [],
            examples: Array.isArray(backendData.examples)
                ? backendData.examples.map((example: any) => ({
                    text: typeof example === 'string' ? example : example.text || '',
                    koreanText: example.koreanText || '',
                    source: example.source || ''
                }))
                : []
        };
    };

    useEffect(() => {
        if (searchWord) {
            fetchDictionaryData(searchWord);
        } else {
            setError('검색어가 없습니다. 단어를 검색해주세요.');
            setLoading(false);
        }
    }, [searchWord]);

    return {
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
    };
};