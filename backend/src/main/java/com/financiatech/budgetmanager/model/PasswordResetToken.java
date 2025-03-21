package com.financiatech.budgetmanager.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document("reset_tokens")
public class PasswordResetToken {
    @Id
    private String id;
    private String email;
    private String token;
    private Instant expiresAt;

    public PasswordResetToken() {}

    public PasswordResetToken(String email, String token, Instant expiresAt) {
        this.email = email;
        this.token = token;
        this.expiresAt = expiresAt;
    }

    public String getId() { return id; }
    public String getEmail() { return email; }
    public String getToken() { return token; }
    public Instant getExpiresAt() { return expiresAt; }

    public void setId(String id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setToken(String token) { this.token = token; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}
