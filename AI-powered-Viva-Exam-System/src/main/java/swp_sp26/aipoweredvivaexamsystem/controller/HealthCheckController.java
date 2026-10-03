package swp_sp26.aipoweredvivaexamsystem.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health Check", description = "Endpoints for verifying system health and OpenAPI status")
public class HealthCheckController {

    @GetMapping
    @Operation(summary = "Check backend service health", description = "Returns system status, service name, and server timestamp.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "System is healthy and operational")
    })
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "AIVES Backend",
                "timestamp", LocalDateTime.now(),
                "docs", "/swagger-ui.html"
        ));
    }
}
