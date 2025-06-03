package com.example.webve.service;

import com.example.webve.service.EmailService;
import com.example.webve.dto.UserDTO;
import com.example.webve.model.User;
import com.example.webve.model.UserSessions;
import com.example.webve.repository.UserRepository;
import com.example.webve.repository.UserSessionRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSessionRepository userSessionRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    private static final long RESET_TOKEN_EXPIRY_MINUTES = 60;

    public void register(UserDTO userDTO) {
        logger.info("Registering user with email: {}, username: {}, password: {}", userDTO.getEmail(), userDTO.getUsername(), userDTO.getPassword());
        if (userDTO.getUsername() == null || userDTO.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (userDTO.getEmail() == null || !EMAIL_PATTERN.matcher(userDTO.getEmail()).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters");
        }

        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already exists");
        }

        String usID = UUID.randomUUID().toString();
        User user = new User();
        user.setUserId(usID);
        user.setEmail(userDTO.getEmail());
        user.setUsername(userDTO.getUsername());
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPassword()));
        user.setRole("user");
        User savedUser = userRepository.save(user);
        logger.info("User saved with ID: {}, email: {}, password hash: {}", savedUser.getUserId(), savedUser.getEmail(), savedUser.getPasswordHash());
    }

    public String login(String email, String password) {
    logger.info("Attempting login with email: {}, password: {}", email, password);
    if (email == null || password == null) {
        throw new IllegalArgumentException("Email and password cannot be null");
    }

    try {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("Authentication successful for email: {}, authorities: {}", email, authentication.getAuthorities());
    } catch (BadCredentialsException e) {
        logger.error("Authentication failed for email: {}. Invalid credentials. Password entered: {}, Hash in DB: {}", email, password, userRepository.findByEmail(email).map(User::getPasswordHash).orElse("Not found"));
        throw new IllegalArgumentException("Invalid email or password: " + e.getMessage());
    } catch (Exception e) {
        logger.error("Authentication error for email: {}. Error: {}", email, e.getMessage());
        throw new IllegalArgumentException("Authentication failed: " + e.getMessage());
    }

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found after authentication"));
    logger.info("Found user: {}, password hash: {}, role: {}", user.getEmail(), user.getPasswordHash(), user.getRole());

    user.setLastLogin(Timestamp.valueOf(LocalDateTime.now()));
    userRepository.save(user);

    String token = jwtService.generateToken(user.getUserId(), user.getRole(), user.getEmail());
    logger.info("Generated JWT token for email: {}", email);

    String ssID = UUID.randomUUID().toString();
    UserSessions session = new UserSessions();
    session.setSessionId(ssID);
    session.setUserId(user.getUserId());
    session.setToken(token);
    session.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
    userSessionRepository.save(session);

    return token;
}

    public UserDTO getUserInfo(String userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(user.getUsername());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole());
        userDTO.setPhoneNumber(user.getPhoneNumber());
        userDTO.setDob(user.getDob());
        userDTO.setGender(user.getGender());
        userDTO.setFullName(user.getFullName());
        return userDTO;
    }

    public void logout(String token) {
        if (token == null) {
            throw new IllegalArgumentException("Token cannot be null");
        }
        Optional<UserSessions> sessionOpt = userSessionRepository.findByToken(token);
        if (sessionOpt.isPresent()) {
            userSessionRepository.delete(sessionOpt.get());
        } else {
            logger.warn("No session found for token: {}", token);
        }
    }

    @Transactional
    public UserDTO updateUserProfile(String userId, UserDTO userDTO) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new IllegalArgumentException("User with ID " + userId + " not found");
        }
        User user = userOptional.get();
        user.setFullName(userDTO.getFullName());
        user.setDob(userDTO.getDob());
        user.setPhoneNumber(userDTO.getPhoneNumber());
        user.setGender(userDTO.getGender());
        userRepository.save(user);
        return userDTO;
    }

    public boolean initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.warn("Forgot password requested for non-existing email: {}", email);
            return false;
        }
        User user = userOpt.get();

        String resetToken = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(RESET_TOKEN_EXPIRY_MINUTES);

        user.setResetToken(resetToken);
        user.setResetTokenExpiry(Timestamp.valueOf(expiryTime));
        userRepository.save(user);

        String resetLink = "http://localhost:8080/reset-password?token=" + resetToken; // Sửa domain
        String subject = "Yêu cầu đặt lại mật khẩu";
        String body = "Bạn nhận được email này vì có yêu cầu đặt lại mật khẩu.\n\n" +
                      "Vui lòng click vào link dưới đây để đặt lại mật khẩu (có hiệu lực trong 60 phút):\n" +
                      resetLink + "\n\n" +
                      "Nếu bạn không yêu cầu, hãy bỏ qua email này.";

        emailService.sendSimpleEmail(email, subject, body);

        logger.info("Password reset token generated and email sent to {}", email);

        return true;
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetToken(token);
        if (userOpt.isEmpty()) {
            logger.warn("Reset password attempt with invalid token: {}", token);
            return false;
        }
        User user = userOpt.get();

        Timestamp expiry = user.getResetTokenExpiry();
        if (expiry == null || expiry.before(Timestamp.valueOf(LocalDateTime.now()))) {
            logger.warn("Reset password attempt with expired token: {}", token);
            return false;
        }

        if (newPassword == null || newPassword.length() < 6) {
            logger.warn("Reset password attempt with invalid new password length");
            return false;
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        logger.info("Password reset successfully for user: {}", user.getEmail());
        return true;
    }
}