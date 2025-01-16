import React, { useState, useEffect } from 'react';
import styles from './SearchPanel.module.css';

interface SearchPanelProps {
  onUserSelect: (user: User | null) => void;
  searchTrigger?: number;
}

interface User {
  userId: number;
  email: string;
  pw: string;
  name: string;
  provider: string;
  birthdate: string;
  exp: number;
  point: number;
  grade: number;
  role: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onUserSelect, searchTrigger }) => {
  const [searchType, setSearchType] = useState<'name' | 'email'>('name');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }
    setError(null);

    try {
      const params: Record<string, string> = searchType === 'name' ? { name: searchQuery } : { email: searchQuery };
      const url = new URL('http://localhost:9999/api/user/search');
      Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      const cleanedData = data.map((user: any) => {
        const { inventory, ...rest } = user;
        return rest;
      });

      setSearchResults(cleanedData);
    } catch (error) {
      setError('사용자를 검색하는 중 오류가 발생했습니다.');
      console.error('Error searching users:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    handleSearch();
  }, [searchTrigger]);

  return (
    <div className={styles.leftSection}>
      <div className={styles.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'name' | 'email')}
          className={styles.searchDropdown}
        >
          <option value="name">이름</option>
          <option value="email">이메일</option>
        </select>
        <input
          type="text"
          placeholder={`${searchType === 'name' ? '이름' : '이메일'} 검색`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          검색
        </button>
      </div>

      <div className={styles.searchResults}>
        {searchResults.map((user) => (
          <div
            key={user.userId}
            className={styles.searchResultItem}
            onClick={() => onUserSelect(user)}
          >
            {user.name} ({user.email})
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPanel; 