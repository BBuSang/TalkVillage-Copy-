export interface DictionaryResponse {
  word: string;
  pronunciation?: string;
  meanings: {
    partOfSpeech: string;
    koreanPartOfSpeech: string;
    definitions: {
      order: number;
      meaning: string;
      koreanMeaning: string;
      type?: string;
    }[];
  }[];
  examples?: {
    text: string;
    koreanText: string;
    source?: string;
  }[];
  idioms?: {
    type: string;
    phrase: string;
    meaning: string;
    koreanMeaning: string;
  }[];
  synonyms?: {  // relatedWords 대신 최상위 레벨로 이동
    word: string;
    meaning?: string;
    koreanMeaning?: string;
  }[];
}

class DictionaryApi {
  private static BASE_URL = 'http://localhost:9999';

  public static async fetchDictionaryData(word: string): Promise<DictionaryResponse> {
    try {
      console.log(`Checking cache for word: ${word}`);
      const cachedData = await this.checkCache(word);
      if (cachedData) {
        console.log('Found cached data:', cachedData);
        return this.processDictionaryData(cachedData);
      }

      console.log(`Fetching dictionary data for word: ${word}`);
      const response = await fetch(
        `${this.BASE_URL}/define?word=${encodeURIComponent(word)}`
      );

      if (!response.ok) {
        console.error(`API Error: Status ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Dictionary API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);  // 추가된 로그

      await this.addWordToDictionary(word, this.processDictionaryData(data));
      return this.processDictionaryData(data);
    } catch (error) {
      console.error('Failed to fetch dictionary data:', error);
      throw error;
    }
  }

  private static async checkCache(word: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/api/dictionarycache/search?word=${encodeURIComponent(word)}`
      );

      if (response.status === 404) {
        console.log('Word not found in cache - normal cache miss');
        return null;
      }

      if (!response.ok) {
        console.error(`Cache check failed: ${response.status}`);
        return null;
      }

      const data = await response.json();
      console.log('Cache hit:', data);
      return data;
    } catch (error) {
      console.warn('Cache check resulted in cache miss:', error);
      return null;
    }
  }

  private static processDictionaryData(data: any): DictionaryResponse {
    if (!data || !Array.isArray(data.meanings)) {
      throw new Error('Invalid dictionary data format');
    }

    // synonyms 데이터 추출 로직 추가
    const synonyms = data.synonyms || data.relatedWords?.synonyms || [];

    return {
      word: data.word || '',
      pronunciation: data.pronunciation || '',
      meanings: data.meanings.map((meaning: any) => ({
        partOfSpeech: meaning.partOfSpeech || '',
        koreanPartOfSpeech: meaning.koreanPartOfSpeech || '',
        definitions: Array.isArray(meaning.definitions)
          ? meaning.definitions.map((def: any) => ({
            order: def.order || 1,
            meaning: def.meaning || '',
            koreanMeaning: def.koreanMeaning || '',
            type: def.type || ''
          }))
          : []
      })),
      examples: Array.isArray(data.examples)
        ? data.examples.map((example: any) => ({
          text: example.text || '',
          koreanText: example.koreanText || '',
          source: example.source || ''
        }))
        : [],
      idioms: Array.isArray(data.idioms)
        ? data.idioms.map((idiom: any) => ({
          type: idiom.type || '',
          phrase: idiom.phrase || '',
          meaning: idiom.meaning || '',
          koreanMeaning: idiom.koreanMeaning || ''
        }))
        : [],
      synonyms: Array.isArray(synonyms)  // 추출된 synonyms 사용
        ? synonyms.map((syn: any) => ({
          word: syn.word || syn || '',
          meaning: syn.meaning || '',
          koreanMeaning: syn.koreanMeaning || ''
        }))
        : []
    };
  }

  public static async translateText(text: string): Promise<string> {
    if (!text || text.trim() === '') {
      return '';
    }

    try {
      const response = await fetch(`${this.BASE_URL}/api/dictionarycache/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          target_lang: 'KO',
        }),
      });

      if (!response.ok) {
        console.error('Translation failed:', response.status);
        throw new Error('Translation request failed');
      }

      const result = await response.json();
      return result.translatedText || text;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  public static async addWordToDictionary(word: string, data: DictionaryResponse): Promise<void> {
    try {
      const url = new URL(`${this.BASE_URL}/api/dictionarycache/add`);
      url.searchParams.append('word', word);

      const response = await fetch(
        url.toString(),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add word failed:', errorText);
        throw new Error(`Failed to add word: ${response.status}`);
      }
      console.log('Successfully added word to cache:', word);
    } catch (error) {
      console.error('Failed to add word:', error);
      throw error;
    }
  }
}

export default DictionaryApi;