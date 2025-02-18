import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DictionaryHeader from '../../components/DictionaryPlacement/Dictionary/DIctionaryHeaderPanel/DictionaryHeader';
import DictionarySearch from '../../components/DictionaryPlacement/Dictionary/DictionarySearchPanel/DictionarySearch';
import DictionaryFooter from '../../components/DictionaryPlacement/Dictionary/DictionaryFooterPanel/DictionaryFooter';

const Dictionary: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>('어학사전');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('전체');

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    switch (language) {
      case '영어':
        setTitle('영어사전');
        break;
      case '한국어':
        setTitle('한국어사전');
        break;
      case '일본어':
        setTitle('일본어사전');
        break;
      case '중국어':
        setTitle('중국어사전');
        break;
      case '한자':
        setTitle('한자사전');
        break;
      default:
        setTitle('어학사전');
    }
  };

  const handleSearch = (searchWord: string) => {
    navigate('/result', {
      state: { 
        searchWord, 
        language: selectedLanguage 
      }
    });
  };

  return (
    <div>
      <DictionaryHeader title="어학사전"/>
      <DictionarySearch 
        onSelectLanguage={handleLanguageSelect} 
        selectedLanguage={selectedLanguage} 
        title={title}
        onSearch={handleSearch}
      />
      <DictionaryFooter />
    </div>
  );
};

export default Dictionary;