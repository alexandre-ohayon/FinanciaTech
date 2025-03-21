package com.financiatech.budgetmanager.service.email;

import org.springframework.stereotype.Component;

@Component
public class ConsoleEmailSender implements EmailSender {
    @Override
    public void send(String to, String subject, String body) {
        System.out.println("""
                --- Simulated Email ---
                To      : %s
                Subject : %s
                ------------------------
                %s
                ------------------------
                """.formatted(to, subject, body));
    }
}
