package com.financiatech.budgetmanager.service.email;

import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final EmailSender emailSender;

    public MailService(EmailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendPasswordReset(String email, String token) {
        String subject = "Réinitialisation de votre mot de passe";
        String body = """
                Bonjour,

                Vous avez demandé à réinitialiser votre mot de passe.

                Voici votre lien de réinitialisation :
                http://localhost:4200/reset-password?token=%s

                Ce lien est valable 15 minutes.
                """.formatted(token);

        emailSender.send(email, subject, body);
    }
}
