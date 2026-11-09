package com.outbid.api.wallet.controller;

import com.outbid.api.common.security.AuthorizationService;
import com.outbid.api.wallet.dto.request.DepositRequest;
import com.outbid.api.wallet.dto.response.WalletResponse;
import com.outbid.api.wallet.dto.response.WalletTransactionResponse;
import com.outbid.api.wallet.service.WalletService;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/wallet")
public class WalletController {
    private final WalletService walletService;
    private final AuthorizationService authorizationService;

    public WalletController(
            WalletService walletService, AuthorizationService authorizationService) {
        this.walletService = walletService;
        this.authorizationService = authorizationService;
    }

    @GetMapping
    public WalletResponse getMyWallet(Authentication authentication) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        return walletService.getMyWallet(userId);
    }

    @PostMapping("/deposit")
    @ResponseStatus(HttpStatus.OK)
    public WalletResponse deposit(
            Authentication authentication, @Valid @RequestBody DepositRequest request) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        return walletService.deposit(userId, request.amount());
    }

    @GetMapping("/transactions")
    public Page<WalletTransactionResponse> getTransactions(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
                    Pageable pageable) {
        UUID userId = authorizationService.getOptionalAuthenticatedUserId(authentication);

        return walletService.getTransactions(userId, pageable);
    }
}
