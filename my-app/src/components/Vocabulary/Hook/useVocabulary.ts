// components/Vocabulary/Hook/useVocabulary.ts
import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9999',
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface VocabularyWord {
  vocabularyListId: number;
  wordEN: string;
  wordKO: string;
  bookmarkState: boolean;
  userId: number;
}

interface UseVocabularyReturn {
  words: VocabularyWord[];
  selectedWords: Set<number>;
  setSelectedWords: React.Dispatch<React.SetStateAction<Set<number>>>;
  currentPage: number;
  wordsPerPage: number;
  displayedWords: VocabularyWord[];
  handleToggleSelect: (id: number) => void;
  handleToggleMemorized: (id: number) => Promise<void>;
  handleDeleteWords: (ids: number[]) => Promise<void>;
  handleUpdateWord: (id: number, wordEN: string, wordKO: string) => Promise<void>;
  addWord: (wordEN: string, wordKO: string) => Promise<void>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  filter: 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED';
  handleFilterChange: (filter: 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED') => void;
  filteredWords: VocabularyWord[];
}

export const useVocabulary = (): UseVocabularyReturn => {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED'>('ALL');
  const wordsPerPage = 10;

  const fetchVocabularyList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/vocabulary/list');
      setWords(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error details:', err.response);
      } else {
        console.error('API Error:', err);
      }
      setError('단어 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabularyList();
  }, []);

  const filteredWords = words.filter(word => {
    switch (filter) {
      case 'MEMORIZED':
        return word.bookmarkState;
      case 'NOT_MEMORIZED':
        return !word.bookmarkState;
      default:
        return true;
    }
  });

  const startIndex = (currentPage - 1) * wordsPerPage;
  const displayedWords = filteredWords.slice(startIndex, startIndex + wordsPerPage);
  const totalPages = Math.ceil(filteredWords.length / wordsPerPage);

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedWords(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  const handleToggleMemorized = async (id: number) => {
    try {
      const word = words.find(w => w.vocabularyListId === id);
      if (!word) return;

      await api.put(`/api/vocabulary/bookmark/${id}`, null, {
        params: { bookmarkState: !word.bookmarkState }
      });

      setWords(prev => prev.map(word => 
        word.vocabularyListId === id 
          ? { ...word, bookmarkState: !word.bookmarkState }
          : word
      ));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error details:', err.response);
      } else {
        console.error('API Error:', err);
      }
      throw new Error('암기 상태 업데이트에 실패했습니다.');
    }
  };

  const handleDeleteWords = async (ids: number[]) => {
    try {
      await Promise.all(ids.map(id => 
        api.delete(`/api/vocabulary/${id}`)
      ));
      
      setWords(prev => prev.filter(word => !ids.includes(word.vocabularyListId)));
      setSelectedWords(new Set());

      const remainingWords = words.filter(word => !ids.includes(word.vocabularyListId));
      const newTotalPages = Math.ceil(remainingWords.length / wordsPerPage);
      if (currentPage > newTotalPages && currentPage > 1) {
        setCurrentPage(newTotalPages);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error details:', err.response);
      } else {
        console.error('API Error:', err);
      }
      throw new Error('단어 삭제에 실패했습니다.');
    }
  };

  const handleUpdateWord = async (id: number, wordEN: string, wordKO: string) => {
    try {
      const params = new URLSearchParams();
      params.append('wordEN', wordEN);
      params.append('wordKO', wordKO);
      
      await api.put(`/api/vocabulary/${id}?${params.toString()}`);
      
      setWords(prev => prev.map(word => 
        word.vocabularyListId === id
          ? { ...word, wordEN, wordKO }
          : word
      ));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error details:', err.response);
      } else {
        console.error('API Error:', err);
      }
      throw new Error('단어 수정에 실패했습니다.');
    }
  };

  const addWord = async (wordEN: string, wordKO: string) => {
    try {
      const params = new URLSearchParams();
      params.append('wordEN', wordEN);
      params.append('wordKO', wordKO);
      
      const response = await api.post('/api/vocabulary?' + params.toString());
      setWords(prev => [response.data, ...prev]);
      
      setCurrentPage(1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('API Error details:', err.response);
      } else {
        console.error('API Error:', err);
      }
      throw new Error('단어 추가에 실패했습니다.');
    }
  };

  const handleFilterChange = (newFilter: 'ALL' | 'MEMORIZED' | 'NOT_MEMORIZED') => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  return {
    words,
    selectedWords,
    setSelectedWords,
    currentPage,
    wordsPerPage,
    displayedWords,
    filteredWords,  // 추가
    handleToggleSelect,
    handleToggleMemorized,
    handleDeleteWords,
    handleUpdateWord,
    addWord,
    setCurrentPage,
    totalPages,
    isLoading,
    error,
    filter,
    handleFilterChange
  };
};