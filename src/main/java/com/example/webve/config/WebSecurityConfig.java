package com.example.webve.config;

import com.example.webve.security.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private CustomLogoutSuccessHandler customLogoutSuccessHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests()
                .requestMatchers("/", "/forgot-password", "/reset-password", "/concert/list", "/login", "/register", "/concerts/**", "/users").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN") // Role 'ADMIN' chỉ có thể truy cập đường dẫn /admin/**
                .anyRequest().authenticated()  // Các yêu cầu còn lại phải được xác thực
            .and()
            .formLogin()
                .loginPage("/login")
                .usernameParameter("email") // Sử dụng email thay vì username
                .passwordParameter("password") // Sử dụng mật khẩu
                .defaultSuccessUrl("/", true) // Sau khi đăng nhập thành công, chuyển hướng đến 
                .failureUrl("/login?error=true") // Sau khi đăng nhập thất bại, quay lại trang login với thông báo lỗi
                .permitAll()
            .and()
            .oauth2Login()
                .loginPage("/login")  // Cấu hình cho OAuth2 login (Google login)
            .and()
            .logout()
                .logoutSuccessHandler(customLogoutSuccessHandler)  // Xử lý logout tùy chỉnh
                .permitAll()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.ALWAYS) // Chỉ tạo session khi cần thiết
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false); // Cho phép đăng nhập mới ngay cả khi đã có session khác
   
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return customUserDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Dùng NoOpPasswordEncoder nếu bạn muốn lưu mật khẩu dạng plain text.
        return NoOpPasswordEncoder.getInstance(); // Không mã hóa mật khẩu
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                   .userDetailsService(customUserDetailsService)
                   .passwordEncoder(passwordEncoder())
                   .and()
                   .build();
    }
}
