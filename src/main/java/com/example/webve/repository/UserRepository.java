package com.example.webve.repository;

import com.example.webve.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserId(String userId);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<User> findByResetToken(String resetToken);
}
