package com.example.webve.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/home", "/api/auth/**", "/upload/**",
                                "/assets-user/**", "/event-detail/**", "/api/events/**",
                                "/contact", "/buy-ticket", "/forgot-password", "/purchase-ticket","/reset-password", "/create-event/**").permitAll() // Cho phép tất cả các endpoint này
                        .requestMatchers("/account/**").hasRole("USER") // Cần xác thực cho các endpoint này
                        .requestMatchers("/admin/**").hasRole("ADMIN") // Cần xác thực cho admin
                        .anyRequest().permitAll() // Cho phép tất cả các yêu cầu khác
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Không sử dụng session
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Forbidden\", \"message\": \"" + accessDeniedException.getMessage() + "\"}");
                        })
                )
                .oauth2Login(oauth2 -> oauth2
                    
                    .defaultSuccessUrl("/", true) // chuyển hướng sau khi đăng nhập thành công
                )
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Giữ lại nếu bạn vẫn cần mã hóa mật khẩu
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager(); // Giữ lại nếu bạn vẫn cần xác thực
    }
}
