package com.example.webve;

import com.example.webve.model.Concert;
import com.example.webve.repository.ConcertRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final ConcertRepository concertRepository;

    public DataInitializer(ConcertRepository concertRepository) {
        this.concertRepository = concertRepository;
    }

    @PostConstruct
    public void init() {
        if (concertRepository.count() == 0) {
            concertRepository.save(new Concert("BlackPink World Tour", "BlackPink", "Seoul Dome", "2025-07-01", "Seoul"));
            concertRepository.save(new Concert("IU Live Concert", "IU", "Busan Arena", "2025-08-15", "Busan"));
            concertRepository.save(new Concert("BTS Reunion Show", "BTS", "Tokyo Dome", "2025-09-20", "Tokyo"));            
        }
    }
}