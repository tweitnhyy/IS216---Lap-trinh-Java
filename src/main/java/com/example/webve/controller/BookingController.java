package com.example.webve.controller;

import com.example.webve.model.Concert;
import com.example.webve.model.Ticket;
import com.example.webve.repository.ConcertRepository;
import com.example.webve.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class BookingController {

    @Autowired
    private ConcertRepository concertRepository;

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping("/book/{id}")
    public String bookForm(@PathVariable Long id, Model model) {
        Concert concert = concertRepository.findById(id).orElseThrow();
        model.addAttribute("concert", concert);
        model.addAttribute("ticket", new Ticket());
        return "book";
    }

    @PostMapping("/book/{id}")
    public String bookTicket(@PathVariable Long id, @ModelAttribute Ticket ticket) {
        Concert concert = concertRepository.findById(id).orElseThrow();
        ticket.setConcert(concert); // chú ý là gọi ticket.setConcert(...) chứ không phải Ticket.setConcert(...)
        ticketRepository.save(ticket);
        return "redirect:/tickets";
    }

    @GetMapping("/tickets")
    public String viewTickets(Model model) {
        model.addAttribute("tickets", ticketRepository.findAll());
        return "tickets";
    }
}
