import React from 'react';
import ResultHeader from '../../components/Result/ResultHeader';
import Resultmain from '../../components/Result/Resultmain';
import TranslationFooter from '../../components/Translation/TranslationFooter';

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