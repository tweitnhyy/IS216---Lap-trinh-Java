package com.example.webve.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.webve.service.EmailService;

@Controller
@RequestMapping("/contact")
public class ContactController {
    private final EmailService emailService;

    @Autowired
    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public String showContactForm() {
        return "user/contact";
    }

    @PostMapping("/send")
    public String handleContactSubmit(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("subject") String subject,
            @RequestParam("message") String message,
            RedirectAttributes redirectAttrs
    ) {
        String recipient = "tuyetnhiktvn@gmail.com"; // Địa chỉ công ty Eventory
        String mailSubject = "[Liên hệ từ trang web] " + subject;
        String mailContent = String.format(
            "Bạn có tin nhắn mới từ trang Liên hệ:\n\n" +
            "Họ và tên: %s\n" +
            "Email người gửi: %s\n" +
            "Chủ đề: %s\n\n" +
            "Nội dung:\n%s",
            name, email, subject, message
        );

        try {
            emailService.sendSimpleEmail(recipient, mailSubject, mailContent);
            redirectAttrs.addFlashAttribute("successMessage", "Gửi thành công! Chúng tôi sẽ liên hệ sớm.");
        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttrs.addFlashAttribute("errorMessage", "Có lỗi xảy ra khi gửi email. Vui lòng thử lại sau.");
        }

        return "redirect:/contact";
    }
}
