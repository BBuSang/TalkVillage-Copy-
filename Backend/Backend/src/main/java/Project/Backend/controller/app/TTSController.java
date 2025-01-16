package Project.Backend.controller.app;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.texttospeech.v1.*;
import com.google.common.collect.Lists;
import com.google.protobuf.ByteString;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

@RestController
@RequestMapping("/api/tts")
@CrossOrigin(origins = "http://localhost:3000")
public class TTSController {

    private final TextToSpeechClient textToSpeechClient;

    public TTSController() {
        try {
            InputStream credentialsStream = getClass().getResourceAsStream("/google-credentials.json");
            if (credentialsStream == null) {
                throw new FileNotFoundException("Google Cloud 인증 파일을 찾을 수 없습니다.");
            }

            GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
                .createScoped(Lists.newArrayList("https://www.googleapis.com/auth/cloud-platform"));

            TextToSpeechSettings settings = TextToSpeechSettings.newBuilder()
                .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
                .build();
            
            this.textToSpeechClient = TextToSpeechClient.create(settings);
        } catch (IOException e) {
            throw new RuntimeException("Google Cloud TTS 클라이언트 초기화 실패: " + e.getMessage(), e);
        }
    }

    @PostMapping("/synthesize")
    public ResponseEntity<?> synthesizeSpeech(@RequestBody TextRequest request) {
        try {
            if (request.getText() == null || request.getText().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("텍스트가 비어있습니다."));
            }

            SynthesisInput input = SynthesisInput.newBuilder()
                .setText(request.getText())
                .build();

            // 학습용 영어 음성 설정
            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                .setLanguageCode("en-US") 
                .setName("en-US-Neural2-G")  // 깔끔하고 명확한 발음의 여성 음성
                .setSsmlGender(SsmlVoiceGender.FEMALE)
                .build();

            // 학습에 적합한 오디오 설정
            AudioConfig audioConfig = AudioConfig.newBuilder()
                .setAudioEncoding(AudioEncoding.MP3)
                .setSpeakingRate(0.9)  // 학습용으로 약간 천천히
                .setPitch(0.0)         // 기본 피치 유지
                .setVolumeGainDb(2.0)  // 볼륨 약간 증가
                .build();

            SynthesizeSpeechResponse response = textToSpeechClient.synthesizeSpeech(
                input, voice, audioConfig);

            ByteString audioContents = response.getAudioContent();
            
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(new AudioResponse(
                    Base64.getEncoder().encodeToString(audioContents.toByteArray())
                ));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("음성 변환 중 오류가 발생했습니다: " + e.getMessage()));
        }
    }
}

@Data
class TextRequest {
    private String text;
}

@Data
class AudioResponse {
    private String audioContent;

    public AudioResponse(String audioContent) {
        this.audioContent = audioContent;
    }
}

@Data
class ErrorResponse {
    private String error;

    public ErrorResponse(String error) {
        this.error = error;
    }
}