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
    // @GetMapping("/contact")
    // public String contact() {
    //     return "user/contact";
    // }
    @GetMapping("/event-detail")
    public String eventDetail() {
        return "user/event-detail"; // Trả về template create-event.html
    }
    @GetMapping("/purchase-ticket")
    public String purchaseTicket () {
        return "user/purchase-ticket"; // Trả về template purchase-ticket.html
    }

    @GetMapping("/account")
    public String account () {
        return "user/account";
    }
    @GetMapping("/account-ticket")
    public String accountTicket () {
        return "user/account-ticket";
    }
    @GetMapping("/account-event")
    public String accountEvent () {
        return "user/account-event";
    }

    @GetMapping("/admin")
    public String admin () {
        return "admin/admin";
    }

    @GetMapping("/reset-password")
    public String reset () {
        return "user/reset-password";
    }
}
