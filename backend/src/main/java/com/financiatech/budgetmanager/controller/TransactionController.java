package com.financiatech.budgetmanager.controller;

import com.financiatech.budgetmanager.kafka.producer.TransactionProducer;
import com.financiatech.budgetmanager.service.TransactionService;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.financiatech.budgetmanager.model.Transaction;


import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionProducer producer;
    private final TransactionService service;

    public TransactionController(TransactionProducer producer, TransactionService service) {
        this.producer = producer;
        this.service = service;
    }

    @PostMapping("/import")
    public ResponseEntity<Void> importCsv(@RequestParam("file") MultipartFile file,
                                          @AuthenticationPrincipal UserDetails user) {
        try (var reader = new InputStreamReader(file.getInputStream())) {
            var parser = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .parse(reader);

            List<Map<String, String>> records = new ArrayList<>();

            for (CSVRecord record : parser) {
                var date = LocalDate.parse(record.get("date"));
                var label = record.get("label");
                var amount = new BigDecimal(record.get("amount"));

                Map<String, String> transaction = new HashMap<>();
                transaction.put("userId", user.getUsername());
                transaction.put("date", date.toString());
                transaction.put("label", label);
                transaction.put("amount", amount.toString());

                records.add(transaction);
            }

            producer.publishImportEvent(records);

            return ResponseEntity.accepted().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id, @AuthenticationPrincipal UserDetails user) {
        service.deleteByIdIfOwned(id, user.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAll(@AuthenticationPrincipal UserDetails user) {
        var transactions = service.findAllByUser(user.getUsername());
        return ResponseEntity.ok(transactions);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Transaction> update(@PathVariable String id, @RequestBody Transaction transaction, @AuthenticationPrincipal UserDetails user) {
        var updatedTransaction = service.updateTransaction(id, transaction, user.getUsername());
        return ResponseEntity.ok(updatedTransaction);
    }
}
