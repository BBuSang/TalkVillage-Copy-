import React from 'react';
import TranslationPanel from '../../components/DictionaryPlacement/Translation/TranslationPanel/TranslationPanel';
import TranslationFooter from '../../components/DictionaryPlacement/Translation/TranslationFooterPanel/TranslationFooter';
import TranslationHeader from '../../components/DictionaryPlacement/Translation/TranslationHeaderPanel/TranslationHeader';

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
