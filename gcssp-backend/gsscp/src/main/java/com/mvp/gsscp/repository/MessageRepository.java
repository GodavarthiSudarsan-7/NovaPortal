package com.mvp.gsscp.repository;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    // ✅ Fetch full chat history between two users (case-insensitive, with sender/receiver loaded)
    @Query("SELECT m FROM Message m " +
           "JOIN FETCH m.sender " +
           "JOIN FETCH m.receiver " +
           "WHERE (LOWER(m.sender.email) = LOWER(:senderEmail) AND LOWER(m.receiver.email) = LOWER(:receiverEmail)) " +
           "   OR (LOWER(m.sender.email) = LOWER(:receiverEmail) AND LOWER(m.receiver.email) = LOWER(:senderEmail)) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findChatHistory(@Param("senderEmail") String senderEmail,
                                  @Param("receiverEmail") String receiverEmail);

    // ✅ Sidebar contacts list
    @Query("SELECT DISTINCT CASE " +
           "WHEN LOWER(m.sender.email) = LOWER(:email) THEN m.receiver " +
           "ELSE m.sender END " +
           "FROM Message m " +
           "WHERE LOWER(m.sender.email) = LOWER(:email) OR LOWER(m.receiver.email) = LOWER(:email)")
    List<Customer> findDistinctContactsByUser(@Param("email") String email);
}
