package com.outbid.api.common.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerMapping;

public class RequestLoggingFilter extends OncePerRequestFilter {
    private static final Logger REQUEST_LOGGER = LoggerFactory.getLogger("com.outbid.api.request");

    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String TRACE_ID_ATTRIBUTE =
            RequestLoggingFilter.class.getName() + ".traceId";

    private static final Pattern SAFE_TRACE_ID = Pattern.compile("[a-zA-Z0-9_-]{1,64}");

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.nanoTime();
        String traceId = resolveTraceId(request);

        response.setHeader(TRACE_ID_HEADER, traceId);
        MDC.put("trace_id", traceId);
        request.setAttribute(TRACE_ID_ATTRIBUTE, traceId);

        try {
            filterChain.doFilter(request, response);
        } catch (IOException | ServletException | RuntimeException exception) {
            REQUEST_LOGGER.error(
                    "Request failed: method={} route={} error={}",
                    request.getMethod(),
                    resolveRoute(request),
                    exception.getClass().getSimpleName());
            throw exception;
        } finally {
            try {
                logRequest(request, response, startTime);
            } finally {
                MDC.remove("trace_id");
                MDC.remove("user_id");
            }
        }
    }

    private void logRequest(
            HttpServletRequest request, HttpServletResponse response, long startTime) {

        String route = resolveRoute(request);
        String method = request.getMethod();
        int status = response.getStatus();
        long latencyMs = (System.nanoTime() - startTime) / 1_000_000;

        String userId = resolveUserId();

        MDC.put("user_id", userId);
        try {
            if (status >= 500) {
                REQUEST_LOGGER.error(
                        "HTTP {} {} status={} latency={}ms Request completed",
                        method,
                        route,
                        status,
                        latencyMs);
            } else if (status >= 400) {
                REQUEST_LOGGER.warn(
                        "HTTP {} {} status={} latency={}ms Request completed",
                        method,
                        route,
                        status,
                        latencyMs);
            } else {
                REQUEST_LOGGER.info(
                        "HTTP {} {} status={} latency={}ms Request completed",
                        method,
                        route,
                        status,
                        latencyMs);
            }
        } finally {
            MDC.remove("user_id");
        }
    }

    private String resolveTraceId(HttpServletRequest request) {
        Object existingTraceId = request.getAttribute(TRACE_ID_ATTRIBUTE);
        if (existingTraceId instanceof String traceId) {
            return traceId;
        }

        String incomingTraceId = request.getHeader(TRACE_ID_HEADER);
        if (incomingTraceId != null && SAFE_TRACE_ID.matcher(incomingTraceId).matches()) {
            return incomingTraceId;
        }

        return UUID.randomUUID().toString();
    }

    private String resolveRoute(HttpServletRequest request) {
        Object route = request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);
        if (route instanceof String routePattern) {
            return routePattern;
        }

        String requestUri = request.getRequestURI();
        String contextPath = request.getContextPath();

        if (!contextPath.isEmpty() && requestUri.startsWith(contextPath)) {
            requestUri = requestUri.substring(contextPath.length());
        }

        return requestUri;
    }

    private String resolveUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof String userId)) {
            return "anonymous";
        }

        return userId;
    }
}
