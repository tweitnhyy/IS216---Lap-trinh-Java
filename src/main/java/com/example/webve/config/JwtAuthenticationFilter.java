package com.example.webve.config;

import com.example.webve.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();
        // Bỏ qua các endpoint công khai
        if (path.startsWith("/api/auth/") || path.equals("/") || path.equals("/home")
                || path.startsWith("/api/location/" ) || path.startsWith("/assets-user/") || path.equals("/reset-password")|| path.equals("/api/home")
                || path.startsWith("/event-detail") || path.startsWith("/account") || path.startsWith("/api/events/no-auth") || path.startsWith("/upload")
                || path.startsWith("/contact") || path.startsWith("/buy-ticket") || path.equals("/create-event") 
                || path.equals("/purchase-ticket") || path.startsWith("/api/vnpay")
        || path.startsWith("/api/upload")  || path.equals("/api/ticket-types"))
        {

            logger.info("Permitting request without authentication: {}", path);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No valid Authorization header found for path: {}", path);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Missing or invalid Authorization header\"}");
            return;
        }

        try {
            String token = authHeader.substring(7).trim();
            String userId = jwtService.extractUserId(token);

            if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtService.isTokenValid(token, userId)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userId, null, null);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.info("Successfully authenticated user with userId: {} for path: {}", userId, path);
                } else {
                    logger.warn("Invalid or expired token for userId: {}", userId);
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid or expired token\"}");
                    return;
                }
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token for path {}: {}", path, e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"Invalid JWT token: " + e.getMessage() + "\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
