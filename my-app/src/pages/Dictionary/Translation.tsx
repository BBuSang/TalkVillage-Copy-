import React from 'react';
import TranslationPanel from '../../components/Translation/TranslationPanel';
import TranslationFooter from '../../components/Translation/TranslationFooter';
import TranslationHeader from '../../components/Translation/TranslationHeader';

const Translation: React.FC = () => {
  return (
    <div>
      <TranslationHeader title="어학사전"/>
      <TranslationPanel/>
      <TranslationFooter />
    </div>
  );
};

export default Translation;
