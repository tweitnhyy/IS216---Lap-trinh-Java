package com.example.webve.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BookingHistoryController {

    @GetMapping("/booking/history")
    public String showBookingHistory() {
        // Hiển thị lịch sử vé đã đặt
        return "booking-history";  // Trang lịch sử vé
    }
}
