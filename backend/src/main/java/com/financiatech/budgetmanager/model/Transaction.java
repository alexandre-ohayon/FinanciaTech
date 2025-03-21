package com.financiatech.budgetmanager.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;

@Document("transactions")
public class Transaction {
    @Id
    private String id;
    private String userId;
    private LocalDate date;
    private String label;
    private BigDecimal amount;
    private String category;

    public Transaction() {}

    public Transaction(String userId, LocalDate date, String label, BigDecimal amount) {
        this.userId = userId;
        this.date = date;
        this.label = label;
        this.amount = amount;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public LocalDate getDate() { return date; }
    public String getLabel() { return label; }
    public BigDecimal getAmount() { return amount; }
    public String getCategory() { return category; }

    public void setId(String id) { this.id = id; }
    public void setUserId(String userId) { this.userId = userId; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setLabel(String label) { this.label = label; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public void setCategory(String category) { this.category = category; }
}
