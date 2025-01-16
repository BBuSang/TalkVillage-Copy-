package Project.Backend.services;

import java.io.File;
import java.net.URL;

import org.springframework.stereotype.Service;

@Service
public class FileStorageService {

    // 리소스 폴더에서 입력 파일 경로 반환
    public String getInputFilePath(String fileName) {
        // 리소스 폴더 내 파일 경로 반환
        URL resource = getClass().getClassLoader().getResource("files/" + fileName);
        if (resource != null) {
            return new File(resource.getFile()).getAbsolutePath();
        } else {
            throw new IllegalArgumentException("File not found in resources: " + fileName);
        }
    }

    // 리소스 폴더 내 출력 파일 경로 반환
    public String getOutputFilePath(String outputFileName) {
        return "src/main/resources/files/" + outputFileName;
    }
}
