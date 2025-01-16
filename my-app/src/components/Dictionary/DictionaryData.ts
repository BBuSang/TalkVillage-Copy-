export interface Definition {
    order: number;
    meaning: string;
    type: string;
  }
  
  export interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }
  
  export interface Synonym {
    word: string;
    meaning: string;
  }
  
  export interface Idiom {
    type: 'idiom' | 'proverb';
    phrase: string;
    meaning: string;
  }
  
  export interface Example {
    text: string;
    source?: string;
  }
  
  export interface DictionaryData {
    word: string;
    pronunciation?: string;
    meanings: Meaning[];
    relatedWords: {
      synonyms: Synonym[];
    };
    idioms: Idiom[];
    examples: Example[];
  }