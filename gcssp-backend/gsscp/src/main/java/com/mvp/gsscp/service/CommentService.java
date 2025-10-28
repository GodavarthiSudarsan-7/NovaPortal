package com.mvp.gsscp.service;

import com.mvp.gsscp.model.Comment;
import com.mvp.gsscp.model.Post;
import com.mvp.gsscp.repository.CommentRepository;
import com.mvp.gsscp.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment addComment(Long postId, Comment comment) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        comment.setPost(post);
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long commentId, Comment updatedComment) {
        Comment existing = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        existing.setText(updatedComment.getText());
        return commentRepository.save(existing);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }
}
