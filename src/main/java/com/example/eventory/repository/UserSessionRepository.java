package com.example.eventory.repository;

import com.example.eventory.entity.UserSessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSessionRepository extends JpaRepository<UserSessions, String> {

    Optional<UserSessions> findByToken(String token);
}