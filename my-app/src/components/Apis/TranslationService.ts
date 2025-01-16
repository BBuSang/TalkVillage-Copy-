// src/services/TranslationService.ts
export class TranslationService {
    private static instance: TranslationService;
    private baseUrl: string = 'http://localhost:9999/api';
    private translationCache: Map<string, string> = new Map();
  
    private constructor() {}
  
    public static getInstance(): TranslationService {
      if (!TranslationService.instance) {
        TranslationService.instance = new TranslationService();
      }
      return TranslationService.instance;
    }
  
    public async translateWord(word: string, targetLang: string = 'KO'): Promise<string> {
      const cacheKey = `${word}-${targetLang}`;
      
      // 캐시에서 확인
      if (this.translationCache.has(cacheKey)) {
        return this.translationCache.get(cacheKey)!;
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: word,
            target_lang: targetLang
          })
        });
  
        if (!response.ok) {
          throw new Error('Translation failed');
        }
  
        const translated = await response.text();
        // 캐시에 저장
        this.translationCache.set(cacheKey, translated);
        return translated;
      } catch (error) {
        console.error('Translation error:', error);
        return word;
      }
    }
  
    // 여러 단어 미리 번역
    public async preloadTranslations(words: string[]): Promise<void> {
      const promises = words.map(word => this.translateWord(word));
      await Promise.all(promises);
    }
  }
  
  export default TranslationService.getInstance();