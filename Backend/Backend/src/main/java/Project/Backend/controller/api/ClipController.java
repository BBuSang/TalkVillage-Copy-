package Project.Backend.controller.api;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Project.Backend.entity.Clips;
import Project.Backend.entity.Sentences;
import Project.Backend.repository.ClipsRespository;
import Project.Backend.repository.SentencesRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ClipController {

    @Autowired
    ClipsRespository clRep;

    @Autowired
    SentencesRepository senRep;

    LocalDate standard = LocalDate.of(2024, 11, 11);

    @PostMapping("/clipCheck")
public ResponseEntity<?> clipCheck() {
    LocalDate today = LocalDate.now();
    Long daysBetween = ChronoUnit.DAYS.between(standard, today);
    Boolean sentenceExists = senRep.existsBysentenceId(daysBetween);

    List<Clips> clipsList = new ArrayList<>();
    String sentenceText = "";

    if (sentenceExists) {
        Sentences sentence = senRep.findBysentenceId(daysBetween);
        clipsList = clRep.findAllBysentence_Sentence(sentence.getSentence());
        sentenceText = sentence.getSentence();
    } else {
        Sentences sentence = senRep.findBysentenceId(0L);
        clipsList = clRep.findAllBysentence_Sentence(sentence.getSentence());
        sentenceText = sentence.getSentence();
    }

    // clipsList에서 URL을 추출하여 반환
    List<Map<String, Object>> clipsData = new ArrayList<>();
    for (Clips clip : clipsList) {
        Map<String, Object> clipData = new HashMap<>();
        clipData.put("clipUrl", clip.getClipUrl());
        clipData.put("startTime", clip.getStartTime());
        clipData.put("endTime", clip.getEndTime());
        clipsData.add(clipData);
    }

    Map<String, Object> response = new HashMap<>();
    response.put("clipsData", clipsData);  // clipsData를 리스트 형태로 전달
    response.put("sentence", sentenceText);
    return ResponseEntity.ok(response);
}

}
