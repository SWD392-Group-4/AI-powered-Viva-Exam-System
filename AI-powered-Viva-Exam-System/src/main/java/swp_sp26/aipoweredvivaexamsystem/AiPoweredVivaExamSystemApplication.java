package swp_sp26.aipoweredvivaexamsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@SpringBootApplication
public class AiPoweredVivaExamSystemApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(AiPoweredVivaExamSystemApplication.class, args);
    }

    /**
     * Tự động nạp các biến cấu hình từ file .env nếu có,
     * giúp tách biệt hoàn toàn mật khẩu nhạy cảm khỏi source code git.
     */
    private static void loadDotEnv() {
        Path[] possiblePaths = new Path[]{
                Path.of(".env"),
                Path.of("AI-powered-Viva-Exam-System/.env"),
                Path.of("../.env")
        };

        for (Path path : possiblePaths) {
            if (Files.exists(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String line : lines) {
                        line = line.trim();
                        if (!line.isEmpty() && !line.startsWith("#") && line.contains("=")) {
                            int idx = line.indexOf('=');
                            String key = line.substring(0, idx).trim();
                            String value = line.substring(idx + 1).trim();
                            if (System.getProperty(key) == null && System.getenv(key) == null) {
                                System.setProperty(key, value);
                            }
                        }
                    }
                } catch (IOException e) {
                    System.err.println("Could not load .env file from " + path + ": " + e.getMessage());
                }
                break;
            }
        }
    }
}
