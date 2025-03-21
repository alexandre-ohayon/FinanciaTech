package com.financiatech.budgetmanager.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class TransactionProducer {
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public TransactionProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = new ObjectMapper();
    }

    public void publishImportEvent(List<Map<String, String>> transactions) {
        try {
            String json = objectMapper.writeValueAsString(transactions);
            kafkaTemplate.send("transactions.imported", json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize transaction list");
        }
    }
}
