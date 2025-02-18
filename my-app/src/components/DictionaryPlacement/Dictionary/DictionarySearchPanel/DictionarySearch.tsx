import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DictionarySearch.module.css';
import languageSprite from '../../../../image/Dictionary/ico_dictionary.png';
import read from '../../../../image/Dictionary/read.png';
import x from '../../../../image/Dictionary/x.png';

type Language = {
  name: string;
  label: string;
  defaultPosition: string;
  activePosition: string;
};

type DictionarySearchProps = {
  onSelectLanguage: (language: string) => void;
  selectedLanguage: string;
  title: string;
  onSearch: (searchWord: string) => void;
};

const DictionarySearch: React.FC<DictionarySearchProps> = ({ 
  onSelectLanguage,
  selectedLanguage,
  title,
  onSearch,
}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const navigate = useNavigate();

  const languages: Language[] = [
    { name: '전체', label: '전체', defaultPosition: '4px 5px', activePosition: '4px -175px' },
    { name: '영어', label: '영어', defaultPosition: '-115px 5px', activePosition: '-115px -175px' },
    { name: '한국어', label: '한국어', defaultPosition: '-175px 5px', activePosition: '-175px -175px' },
    { name: '일본어', label: '일본어', defaultPosition: '-236px 5px', activePosition: '-236px -175px' },
    { name: '중국어', label: '중국어', defaultPosition: '-295px 4px', activePosition: '-295px -175px' },
    { name: '한자', label: '한자', defaultPosition: '-355px 5px', activePosition: '-355px -175px' },
  ];

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const clearInput = () => {
    setInputValue('');
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      onSearch(inputValue);
      navigate(`/result?word=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <main className={styles.dictionarySearch}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.searchContainer}>
        <div className={styles.inputIconContainer}>
          <input
            type="text"
            placeholder="단어, 문장을 검색하세요"
            className={styles.searchInput}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          <button className={styles.searchIcon} onClick={handleSearch}>
            <img src={read} alt="Search" className={styles.searchIconImage} />
          </button>
          {inputValue && (
            <button className={styles.clearIcon} onClick={clearInput}>
              <img src={x} alt="Clear" className={styles.clearIconImage} />
            </button>
          )}
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {languages.map((lang) => (
          <div key={lang.name} className={styles.languageButtonContainer}>
            <button
              className={`${styles.languageButton} ${selectedLanguage === lang.name ? styles.active : ''}`}
              onClick={() => onSelectLanguage(lang.name)}
              style={{
                backgroundImage: `url(${languageSprite})`,
                backgroundPosition: selectedLanguage === lang.name ? lang.activePosition : lang.defaultPosition,
              }}
            ></button>
            <span className={styles.languageLabel}>{lang.label}</span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default DictionarySearch;