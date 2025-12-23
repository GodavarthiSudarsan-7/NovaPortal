package com.mvp.gsscp.repository;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    
    @Query("SELECT DISTINCT m FROM Message m " +
           "JOIN FETCH m.sender s " +
           "JOIN FETCH m.receiver r " +
           "WHERE (LOWER(s.email) = LOWER(:senderEmail) AND LOWER(r.email) = LOWER(:receiverEmail)) " +
           "   OR (LOWER(s.email) = LOWER(:receiverEmail) AND LOWER(r.email) = LOWER(:senderEmail)) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findChatHistory(@Param("senderEmail") String senderEmail,
                                  @Param("receiverEmail") String receiverEmail);

   
    @Query("SELECT DISTINCT CASE " +
           "WHEN LOWER(m.sender.email) = LOWER(:email) THEN m.receiver " +
           "ELSE m.sender END " +
           "FROM Message m " +
           "WHERE LOWER(m.sender.email) = LOWER(:email) OR LOWER(m.receiver.email) = LOWER(:email)")
    List<Customer> findDistinctContactsByUser(@Param("email") String email);

   
    @Query(value = "SELECT * FROM messages m " +
                   "JOIN customers s ON m.sender_id = s.id " +
                   "JOIN customers r ON m.receiver_id = r.id " +
                   "WHERE LOWER(s.email) = LOWER(:senderEmail) " +
                   "AND LOWER(r.email) = LOWER(:receiverEmail) " +
                   "AND LOWER(TRIM(m.content)) = LOWER(TRIM(:content)) " +
                   "AND m.created_at >= (NOW() - INTERVAL 2 SECOND) " +
                   "LIMIT 1",
           nativeQuery = true)
    Optional<Message> findRecentDuplicate(@Param("senderEmail") String senderEmail,
                                          @Param("receiverEmail") String receiverEmail,
                                          @Param("content") String content);
}
