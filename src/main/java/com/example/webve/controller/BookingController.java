package com.example.webve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
@SuppressWarnings("unused")
@Controller
public class BookingController {

    @GetMapping("/concert/{id}/book")
    public String showBookingPage(@PathVariable Long id) {
        // Xử lý việc đặt vé cho concert với id tương ứng
        return "concert-booking";  // Trang đặt vé
    }
}
