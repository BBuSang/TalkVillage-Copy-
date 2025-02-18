// DictionaryData.ts
export interface Definition {
  order: number;
  meaning: string;
  koreanMeaning?: string;
  type: string;
  koreanType?: string;
}

export interface Meaning {
  partOfSpeech: string;
  koreanPartOfSpeech?: string;
  definitions: Definition[];
}

export interface Synonyms {
  word: string;
  meaning: string;
  koreanMeaning?: string;
}

export interface Idiom {
  type: string;
  phrase: string;
  meaning: string;
  koreanMeaning?: string;
}

export interface Example {
  text: string;
  koreanText?: string;
  source?: string;
}

export interface DictionaryData {
  word: string;
  koreanWord?: string;  // 추가
  pronunciation?: string;
  meanings: Meaning[];
  synonyms?: Synonyms[];
  idioms: Idiom[];
  examples: Example[];
}