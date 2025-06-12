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
        return "user/create-event"; 
    }
    @GetMapping("/event-detail")
    public String eventDetail() {
        return "user/event-detail"; 
    }
    @GetMapping("/purchase-ticket")
    public String purchaseTicket () {
        return "user/purchase-ticket";
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
    @GetMapping("/reset-password")
    public String reset () {
        return "user/reset-password";
    }
}
