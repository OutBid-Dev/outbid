package com.outbid.api.health;

import com.outbid.api.common.reponse.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {
  @GetMapping
  public ApiResponse<HealthResponse> health() {
    return ApiResponse.success("OutBid API is running", new HealthResponse("ok"));
  }
}
