package com.example.webve.controller;

import com.example.webve.model.Concert;
import com.example.webve.service.ConcertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class ConcertController {

    @Autowired
    private ConcertService concertService;

    // Danh sách concert
    @GetMapping("/concert/list")
    public String showConcertList(Model model) {
        model.addAttribute("concerts", concertService.getAllConcerts());
        return "concert-list"; // Hiển thị danh sách concert
    }

    // Chi tiết concert
    @GetMapping("/concert/{id}")
    public String showConcertDetail(@PathVariable Long id, Model model) {
        Concert concert = concertService.getConcertById(id);
        model.addAttribute("concert", concert);
        return "concert-detail"; // Hiển thị chi tiết concert
    }
}
