package com.financiatech.budgetmanager.service.email;

public interface EmailSender {
    void send(String to, String subject, String body);
}
