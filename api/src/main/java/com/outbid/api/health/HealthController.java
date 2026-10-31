package com.outbid.api.health;

import com.outbid.api.common.reponse.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {
    @GetMapping
    public ResponseEntity<ApiResponse<HealthResponse>> health() {
        return ApiResponse.success(
                HttpStatus.OK, "OutBid API is running", new HealthResponse("ok"));
    }
}
