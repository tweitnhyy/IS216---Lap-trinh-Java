package com.example.webve.service;

import com.example.webve.model.PasswordResetToken;
import com.example.webve.model.User;
import com.example.webve.repository.PasswordResetTokenRepository;
import com.example.webve.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private PasswordResetTokenRepository tokenRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // Bạn vẫn có thể sử dụng PasswordEncoder nếu cần mã hóa ở các nơi khác

    public String createPasswordResetToken(String email) {
        User user = userRepo.findByEmail(email);
        if (user == null) return null;

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, user);
        tokenRepo.save(resetToken);
        return token;
    }

    public void sendResetEmail(String email, String resetLink) {
        emailService.send(email, "Liên kết đặt lại mật khẩu: " + resetLink);
    }

    public boolean updatePassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepo.findByToken(token);
        if (resetToken == null || resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return false; // Token không hợp lệ hoặc hết hạn
        }

        User user = resetToken.getUser();
        user.setPassword(newPassword);  // Dùng mật khẩu raw mà không mã hóa
        userRepo.save(user);
        tokenRepo.delete(resetToken);  // Xóa token sau khi reset
        return true;
    }

    public User registerUser(User user) {
        // Không mã hóa mật khẩu khi đăng ký (raw password)
        return userRepo.save(user);
    }

    public User saveUser(User user) {
        // Nếu cần mã hóa mật khẩu ở một số nơi khác
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepo.save(user);
    }

    public User findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public List<User> findAllUsers() {
        return userRepo.findAll(); // Lấy tất cả người dùng
    }
}
