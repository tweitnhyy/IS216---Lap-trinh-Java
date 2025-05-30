package com.example.webve.dto;


import lombok.Data;
import com.example.webve.model.User;

@Data
public class UserDTO {
    private String userId;
    private String username;
    private String email;
    private String password;
    private String role;

    public User toEntity() {
        User entity = new User();
        entity.setEmail(this.email);
        entity.setPasswordHash(this.password); // Sẽ được mã hóa trong service
        entity.setUsername(this.username);
        entity.setRole(this.role);
        return entity;
    }

    public static UserDTO fromEntity(User entity) {
        UserDTO dto = new UserDTO();
        dto.setEmail(entity.getEmail());
        dto.setUsername(entity.getUsername());
        dto.setRole(entity.getRole());
        return dto;
    }
}