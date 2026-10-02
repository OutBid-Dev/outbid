package com.outbid.api.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(@NotBlank String firstName,

                @NotBlank String lastName,

                @Email @NotBlank String email,

                String image,

                @NotBlank String password) {
}
