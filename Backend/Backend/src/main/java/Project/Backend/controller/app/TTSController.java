package Project.Backend.controller.app;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import java.util.concurrent.TimeUnit;

import javax.annotation.PreDestroy;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.api.gax.core.FixedCredentialsProvider;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.texttospeech.v1.AudioConfig;
import com.google.cloud.texttospeech.v1.AudioEncoding;
import com.google.cloud.texttospeech.v1.SsmlVoiceGender;
import com.google.cloud.texttospeech.v1.SynthesisInput;
import com.google.cloud.texttospeech.v1.SynthesizeSpeechResponse;
import com.google.cloud.texttospeech.v1.TextToSpeechClient;
import com.google.cloud.texttospeech.v1.TextToSpeechSettings;
import com.google.cloud.texttospeech.v1.VoiceSelectionParams;
import com.google.common.collect.Lists;
import com.google.protobuf.ByteString;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Configuration
class TTSConfig {
    private TextToSpeechClient textToSpeechClient;

    @Bean
    public TextToSpeechClient textToSpeechClient() throws IOException {
        InputStream credentialsStream = getClass().getResourceAsStream("/google-credentials.json");
        if (credentialsStream == null) {
            throw new FileNotFoundException("Google Cloud 인증 파일을 찾을 수 없습니다.");
        }

        GoogleCredentials credentials = GoogleCredentials.fromStream(credentialsStream)
            .createScoped(Lists.newArrayList("https://www.googleapis.com/auth/cloud-platform"));

        TextToSpeechSettings settings = TextToSpeechSettings.newBuilder()
            .setCredentialsProvider(FixedCredentialsProvider.create(credentials))
            .build();
        
        textToSpeechClient = TextToSpeechClient.create(settings);
        return textToSpeechClient;
    }

    @PreDestroy
    public void destroy() {
        try {
            if (textToSpeechClient != null) {
                textToSpeechClient.shutdown();
                boolean terminated = textToSpeechClient.awaitTermination(5, TimeUnit.SECONDS);
                if (!terminated) {
                    textToSpeechClient.shutdownNow();
                }
            }
        } catch (Exception e) {
            // 예외 처리만 하고 로깅 제거
        }
    }
}

@RestController
@RequestMapping("/api/tts")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class TTSController {

    private final TextToSpeechClient textToSpeechClient;

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

            VoiceSelectionParams voice = VoiceSelectionParams.newBuilder()
                .setLanguageCode("en-US") 
                .setName("en-US-Neural2-G")
                .setSsmlGender(SsmlVoiceGender.FEMALE)
                .build(); 

            AudioConfig audioConfig = AudioConfig.newBuilder()
                .setAudioEncoding(AudioEncoding.MP3)
                .setSpeakingRate(0.9)
                .setPitch(0.0)
                .setVolumeGainDb(2.0)
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