package com.example.webve.repository;

import com.example.webve.model.UserSessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSessions, String> {

    Optional<UserSessions> findByToken(String token);
    Optional<UserSessions> findByUserId(String userId);
}