package com.financiatech.budgetmanager.dto;

public record ResetPasswordRequest(String token, String newPassword) {}
