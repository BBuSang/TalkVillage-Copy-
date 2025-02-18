import React from 'react';
import ResultHeader from '../../components/DictionaryPlacement/Result/ResultHeaderPanel/ResultHeader';
import Resultmain from '../../components/DictionaryPlacement/Result/ResultMainPanel/Resultmain';
import TranslationFooter from '../../components/DictionaryPlacement/Translation/TranslationFooterPanel/TranslationFooter';

const Result: React.FC = () => {
  return (
    <div>
      <ResultHeader/>
      <Resultmain />
      <TranslationFooter />
    </div>
  );
};

export default Result;