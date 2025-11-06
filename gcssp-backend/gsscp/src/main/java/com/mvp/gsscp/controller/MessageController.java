package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.model.Message;
import com.mvp.gsscp.repository.CustomerRepository;
import com.mvp.gsscp.repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ 1. Get all messages between two users (sorted oldest → newest)
    @GetMapping("/{senderEmail}/{receiverEmail}")
    public List<Message> getMessages(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {
        System.out.println("🔍 Fetching chat between: " + senderEmail + " & " + receiverEmail);
        List<Message> messages = messageRepository.findChatHistory(
                senderEmail.toLowerCase(),
                receiverEmail.toLowerCase()
        );
        System.out.println("📦 Found " + messages.size() + " messages in DB.");
        return messages;
    }

    // ✅ 2. Save a new message (called from Node.js)
    @PostMapping
    @Transactional
    public Map<String, Object> saveMessage(@RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();
        try {
            // 🧠 FIXED: match Node.js — it sends "receiver" not "recipient"
            String senderEmail = body.get("sender");
            String receiverEmail = body.get("receiver");
            String text = body.get("message");

            System.out.println("📩 Incoming message payload: " + body);

            if (senderEmail == null || receiverEmail == null || text == null || text.trim().isEmpty()) {
                resp.put("error", "Missing required fields");
                return resp;
            }

            // ✅ Ensure sender exists
            Customer sender = customerRepository.findByEmail(senderEmail.toLowerCase())
                    .orElseGet(() -> {
                        Customer c = new Customer();
                        c.setEmail(senderEmail.toLowerCase());
                        c.setName(senderEmail.split("@")[0]);
                        c.setPassword("temp");
                        c.setCreatedAt(Instant.now().toString());
                        c.setUpdatedAt(Instant.now().toString());
                        return customerRepository.save(c);
                    });

            // ✅ Ensure receiver exists
            Customer receiver = customerRepository.findByEmail(receiverEmail.toLowerCase())
                    .orElseGet(() -> {
                        Customer c = new Customer();
                        c.setEmail(receiverEmail.toLowerCase());
                        c.setName(receiverEmail.split("@")[0]);
                        c.setPassword("temp");
                        c.setCreatedAt(Instant.now().toString());
                        c.setUpdatedAt(Instant.now().toString());
                        return customerRepository.save(c);
                    });

            // ✅ Save message
            Message msg = new Message();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setContent(text.trim());
            msg.setCreatedAt(Instant.now());
            msg.setStatus("sent");

            Message savedMsg = messageRepository.saveAndFlush(msg);

            System.out.println("✅ Message saved in DB (ID: " + savedMsg.getId() + ")");
            resp.put("success", true);
            resp.put("data", savedMsg);

        } catch (Exception e) {
            System.err.println("❌ Failed to save message: " + e.getMessage());
            e.printStackTrace();
            resp.put("error", e.getMessage());
        }

        return resp;
    }

    // ✅ 3. Mark messages as seen
    @PutMapping("/seen/{senderEmail}/{receiverEmail}")
    public Map<String, Object> markSeen(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {
        Map<String, Object> resp = new HashMap<>();
        try {
            List<Message> msgs = messageRepository.findChatHistory(senderEmail, receiverEmail);
            for (Message m : msgs) {
                if (!m.getSender().getEmail().equalsIgnoreCase(senderEmail)) {
                    m.setStatus("seen");
                }
            }
            messageRepository.saveAll(msgs);
            resp.put("message", "✅ Messages marked as seen!");
        } catch (Exception e) {
            resp.put("error", "Failed to mark messages as seen: " + e.getMessage());
        }
        return resp;
    }

    // ✅ 4. Fetch distinct chat contacts for sidebar
    @GetMapping("/contacts/{email}")
    public List<Customer> getChatContacts(@PathVariable String email) {
        List<Customer> contacts = messageRepository.findDistinctContactsByUser(email.toLowerCase());
        System.out.println("👥 Found " + contacts.size() + " chat contacts for " + email);
        return contacts;
    }
}
