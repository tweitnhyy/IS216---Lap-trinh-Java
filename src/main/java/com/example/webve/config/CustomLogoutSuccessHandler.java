package com.example.webve.config;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {

    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // Ghi log thông tin người dùng đã đăng xuất
        String username = authentication != null ? authentication.getName() : "Guest";
        System.out.println("Người dùng " + username + " đã đăng xuất thành công.");

        // Chuyển hướng đến trang thành công
        response.sendRedirect(request.getContextPath() + "/logout-success");
    }

}