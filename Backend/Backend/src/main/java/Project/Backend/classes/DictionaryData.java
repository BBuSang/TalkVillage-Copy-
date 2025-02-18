package Project.Backend.classes;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class DictionaryData {
    private String word;
    private String pronunciation;
    private List<Meaning> meanings;
    private List<Example> examples;
    private List<Idiom> idioms;
    private RelatedWords relatedWords;
    private LocalDateTime lastAccessed;

    public void setSynonyms(List<Synonym> synonyms) {
        if (this.relatedWords == null) {
            this.relatedWords = new RelatedWords();
        }
        this.relatedWords.setSynonyms(synonyms);
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Meaning {
        private String partOfSpeech;
        private String koreanPartOfSpeech;
        private List<Definition> definitions;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Definition {
        private int order;
        private String meaning;
        private String koreanMeaning;
        private String type;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Example {
        private String text;
        private String koreanText;
        private String source;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Idiom {
        private String type;
        private String phrase;
        private String meaning;
        private String koreanMeaning;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RelatedWords {
        private List<Synonym> synonyms;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Synonym {
        private String word;
        private String meaning;
        private String koreanMeaning;
    }
}