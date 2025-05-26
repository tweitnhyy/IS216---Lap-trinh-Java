package com.example.webve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UserController {

    @GetMapping("/")
    public String home() {
        return "user/home";
    }

    @GetMapping("/buy-ticket")
    public String buyTicket() {
        return "user/buy-ticket";
    }
    @GetMapping("/create-event")
    public String createEvent() {
        return "user/create-event"; // Trả về template create-event.html
    }
    @GetMapping("/contact")
    public String contact() {
        return "user/contact"; // Trả về template create-event.html
    }
    @GetMapping("/event-detail")
    public String eventDetail() {
        return "user/event-detail"; // Trả về template create-event.html
    }
    @GetMapping("/purchase-ticket")
    public String purchaseTicket () {
        return "user/purchase-ticket"; // Trả về template purchase-ticket.html
    }
}
