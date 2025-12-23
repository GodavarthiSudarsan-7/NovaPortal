package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Comment;
import com.mvp.gsscp.model.Post;
import com.mvp.gsscp.repository.CommentRepository;
import com.mvp.gsscp.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

   
    @GetMapping("/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentRepository.findByPostId(postId);
    }

 
    @PostMapping
    public Map<String, Object> addComment(@RequestBody Map<String, Object> payload) {
        Map<String, Object> response = new HashMap<>();

        try {
            Long postId = Long.valueOf(payload.get("postId").toString());
            String text = (String) payload.get("text");
            String userEmail = (String) payload.get("userEmail");

            if (text == null || text.trim().isEmpty()) {
                response.put("error", "Comment cannot be empty!");
                return response;
            }

            Optional<Post> postOpt = postRepository.findById(postId);
            if (postOpt.isEmpty()) {
                response.put("error", "Post not found");
                return response;
            }

            Comment comment = new Comment();
            comment.setText(text);
            comment.setUserEmail(userEmail);
            comment.setPost(postOpt.get());
            commentRepository.save(comment);

            response.put("message", "✅ Comment added successfully");
            response.put("comment", comment);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Failed to add comment: " + e.getMessage());
        }

        return response;
    }

   
    @PutMapping("/{id}")
    public Map<String, Object> updateComment(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Comment> commentOpt = commentRepository.findById(id);
            if (commentOpt.isEmpty()) {
                response.put("error", "Comment not found!");
                return response;
            }

            Comment comment = commentOpt.get();
            String userEmail = body.get("userEmail");
            String newText = body.get("text");

            if (!comment.getUserEmail().equals(userEmail)) {
                response.put("error", "⚠️ You can only edit your own comments!");
                return response;
            }

            if (newText != null && !newText.trim().isEmpty()) {
                comment.setText(newText);
                commentRepository.save(comment);
                response.put("message", "✏️ Comment updated successfully!");
                response.put("comment", comment);
            } else {
                response.put("error", "Comment text cannot be empty!");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Failed to update comment: " + e.getMessage());
        }

        return response;
    }

   
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteComment(
            @PathVariable Long id,
            @RequestParam(required = false) String userEmail
    ) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Comment> commentOpt = commentRepository.findById(id);
            if (commentOpt.isEmpty()) {
                response.put("error", "❌ Comment not found!");
                return response;
            }

            Comment comment = commentOpt.get();

            if (userEmail != null && !comment.getUserEmail().equals(userEmail)) {
                response.put("error", "⚠️ You can only delete your own comments!");
                return response;
            }

            commentRepository.deleteById(id);
            response.put("message", "🗑️ Comment deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Could not delete comment: " + e.getMessage());
        }
        return response;
    }
}
