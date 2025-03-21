package com.financiatech.budgetmanager.service;

import com.financiatech.budgetmanager.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import com.financiatech.budgetmanager.model.Transaction;

import java.util.List;

@Service
public class TransactionService {
    private final TransactionRepository repository;

    public TransactionService(TransactionRepository repository) {
        this.repository = repository;
    }

    public Transaction updateTransaction(String id, Transaction transaction, String userEmail) {
        // Vérifie si la transaction appartient à l'utilisateur
        var existingTransaction = repository.findByIdAndUserId(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable ou non autorisée"));

        // Mise à jour des champs
        existingTransaction.setLabel(transaction.getLabel());
        existingTransaction.setAmount(transaction.getAmount());
        existingTransaction.setCategory(transaction.getCategory());
        existingTransaction.setDate(transaction.getDate());

        return repository.save(existingTransaction);
    }

    public void deleteByIdIfOwned(String id, String userEmail) {
        var tx = repository.findByIdAndUserId(id, userEmail)
                .orElseThrow(() -> new RuntimeException("Transaction introuvable ou non autorisée"));

        repository.deleteById(tx.getId());
    }

    public List<Transaction> findAllByUser(String userEmail) {
        return repository.findByUserId(userEmail);
    }
}
