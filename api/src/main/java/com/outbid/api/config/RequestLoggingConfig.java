package com.outbid.api.config;

import com.outbid.api.common.logging.RequestLoggingFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RequestLoggingConfig {

    @Bean
    RequestLoggingFilter requestLoggingFilter() {
        return new RequestLoggingFilter();
    }

    @Bean
    FilterRegistrationBean<RequestLoggingFilter> disableRequestLoggingServletRegistration(
            RequestLoggingFilter requestLoggingFilter) {

        FilterRegistrationBean<RequestLoggingFilter> registration =
                new FilterRegistrationBean<>(requestLoggingFilter);

        registration.setEnabled(false);

        return registration;
    }
}
