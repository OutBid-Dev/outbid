package com.outbid.api.auth.service;

import com.outbid.api.auth.model.User;

public interface RefreshTokenService {
    String create(User user);
}
