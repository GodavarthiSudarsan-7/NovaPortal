package com.mvp.gsscp.model;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "messages")
public class Message implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Sender (customer)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private Customer sender;

    // Receiver (customer) — can be null for broadcast / group messages depending on your design
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private Customer receiver;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    // Timestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Optional: message status (sent, delivered, read)
    @Column(name = "status")
    private String status;

    public Message() {
        this.createdAt = Instant.now();
    }

    public Message(Customer sender, Customer receiver, String content) {
        this.sender = sender;
        this.receiver = receiver;
        this.content = content;
        this.createdAt = Instant.now();
        this.status = "sent";
    }

    // ---- Getters / Setters ----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getSender() {
        return sender;
    }

    public void setSender(Customer sender) {
        this.sender = sender;
    }

    public Customer getReceiver() {
        return receiver;
    }

    public void setReceiver(Customer receiver) {
        this.receiver = receiver;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
