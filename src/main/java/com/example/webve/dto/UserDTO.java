package com.example.webve.dto;


import lombok.Data;
import com.example.webve.model.User;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Data
public class UserDTO {
    private String userId;
    private String username;
    private String email;
    private String password;
    private String role;
    private String fullName;
    private Date dob;
    private String phoneNumber;
    private String gender;
    private Timestamp lastLogin;
    private String resetToken;
    private Timestamp resetTokenExpiry;
    private List<String> eventIds;


    public User toEntity() {
        User entity = new User();
        entity.setEmail(this.email);
        entity.setPasswordHash(this.password); // Sẽ được mã hóa trong service
        entity.setUsername(this.username);
        entity.setRole(this.role);
        entity.setResetToken(this.resetToken);
        entity.setResetTokenExpiry(this.resetTokenExpiry);
        return entity;
    }

    public static UserDTO fromEntity(User entity) {
        UserDTO dto = new UserDTO();
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUsername());
        dto.setRole(entity.getRole());
        dto.setResetToken(entity.getResetToken());
        dto.setResetTokenExpiry(entity.getResetTokenExpiry());
        return dto;
    }
}