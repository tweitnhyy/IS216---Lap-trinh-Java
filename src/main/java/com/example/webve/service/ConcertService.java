package com.example.webve.service;

import com.example.webve.model.Concert;
import com.example.webve.repository.ConcertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConcertService {

    @Autowired
    private ConcertRepository concertRepository;

    // Lấy tất cả concert
    public List<Concert> getAllConcerts() {
        return concertRepository.findAll();
    }

    // Lấy concert theo ID
    public Concert getConcertById(Long id) {
        Optional<Concert> concert = concertRepository.findById(id);
        return concert.orElse(null);
    }
}
