package com.mvp.gsscp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatNotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    @PostMapping("/new")
    public void sendNewChatNotification(@RequestBody Map<String, String> payload) {
        String receiverEmail = payload.get("receiverEmail");
        String senderName = payload.get("senderName");

        messagingTemplate.convertAndSend(
                "/topic/new-message/" + receiverEmail,
                "💬 New message from " + senderName
        );
    }
}
