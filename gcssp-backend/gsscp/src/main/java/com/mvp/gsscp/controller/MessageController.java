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

    // ✅ 1. Get all messages between two users (case-insensitive, sorted oldest → newest)
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

    // ✅ 2. Save new message (called by Node.js backend)
    @PostMapping
    @Transactional
    public Map<String, Object> saveMessage(@RequestBody Map<String, String> body) {
        Map<String, Object> resp = new HashMap<>();
        try {
            String senderEmail = body.get("sender");
            String receiverEmail = body.get("recipient");
            String text = body.get("message");

            System.out.println("📩 Incoming message: " + body);

            if (senderEmail == null || receiverEmail == null || text == null || text.trim().isEmpty()) {
                resp.put("error", "Missing required fields");
                return resp;
            }

            // ✅ Ensure sender exists
            Customer sender = customerRepository.findByEmail(senderEmail.toLowerCase())
                    .orElseGet(() -> {
                        Customer newSender = new Customer();
                        newSender.setEmail(senderEmail.toLowerCase());
                        newSender.setName(senderEmail.split("@")[0]);
                        newSender.setPassword("temp");
                        newSender.setCreatedAt(Instant.now().toString());
                        newSender.setUpdatedAt(Instant.now().toString());
                        return customerRepository.save(newSender);
                    });

            // ✅ Ensure receiver exists
            Customer receiver = customerRepository.findByEmail(receiverEmail.toLowerCase())
                    .orElseGet(() -> {
                        Customer newReceiver = new Customer();
                        newReceiver.setEmail(receiverEmail.toLowerCase());
                        newReceiver.setName(receiverEmail.split("@")[0]);
                        newReceiver.setPassword("temp");
                        newReceiver.setCreatedAt(Instant.now().toString());
                        newReceiver.setUpdatedAt(Instant.now().toString());
                        return customerRepository.save(newReceiver);
                    });

            System.out.println("💾 Sender: " + sender.getEmail() + " | Receiver: " + receiver.getEmail());

            // ✅ Create and save message
            Message msg = new Message();
            msg.setSender(sender);
            msg.setReceiver(receiver);
            msg.setContent(text);
            msg.setCreatedAt(Instant.now());
            msg.setStatus("sent");

            Message savedMsg = messageRepository.saveAndFlush(msg);

            System.out.println("✅ Message saved to DB (ID: " + savedMsg.getId() + ")");
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
            System.out.println("👀 Seen status updated for chat between " + senderEmail + " & " + receiverEmail);

        } catch (Exception e) {
            e.printStackTrace();
            resp.put("error", "Failed to mark messages as seen: " + e.getMessage());
        }

        return resp;
    }

    // ✅ 4. Get chat contacts (used for sidebar)
    @GetMapping("/contacts/{email}")
    public List<Customer> getChatContacts(@PathVariable String email) {
        List<Customer> contacts = messageRepository.findDistinctContactsByUser(email.toLowerCase());
        System.out.println("👥 Contacts for " + email + ": " + contacts.size());
        return contacts;
    }
}
