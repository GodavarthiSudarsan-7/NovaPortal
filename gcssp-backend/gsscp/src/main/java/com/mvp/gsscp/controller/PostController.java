package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.model.Post;
import com.mvp.gsscp.repository.CustomerRepository;
import com.mvp.gsscp.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ Fetch all posts (newest first)
    @GetMapping
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        Collections.reverse(posts);
        return posts;
    }

    // ✅ Create a new post (must be from a registered user)
    @PostMapping
    public Map<String, Object> addPost(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = body.get("email");
            String content = body.get("content");
            String imageUrl = body.get("imageUrl");

            if (email == null || email.trim().isEmpty()) {
                response.put("error", "Email is required!");
                return response;
            }
            if (content == null || content.trim().isEmpty()) {
                response.put("error", "Content cannot be empty!");
                return response;
            }

            Optional<Customer> customerOpt = customerRepository.findByEmail(email);
            if (customerOpt.isEmpty()) {
                response.put("error", "⚠️ No user found with email: " + email);
                return response;
            }

            Customer customer = customerOpt.get();

            Post post = new Post();
            post.setCustomer(customer);
            post.setContent(content);
            post.setImageUrl((imageUrl != null && !imageUrl.isEmpty()) ? imageUrl : null);

            postRepository.save(post);

            response.put("message", "✅ Post created successfully!");
            response.put("post", post);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Failed to create post: " + e.getMessage());
        }

        return response;
    }

    // ✅ Update post content
    @PutMapping("/{postId}")
    public Map<String, Object> updatePost(@PathVariable Long postId, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Post> postOpt = postRepository.findById(postId);
            if (postOpt.isEmpty()) {
                response.put("error", "❌ Post not found!");
                return response;
            }

            Post post = postOpt.get();
            String newContent = body.get("content");
            String newImageUrl = body.get("imageUrl");

            if (newContent != null) post.setContent(newContent);
            if (newImageUrl != null) post.setImageUrl(newImageUrl);

            postRepository.save(post);
            response.put("message", "✅ Post updated successfully!");
            response.put("post", post);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Failed to update post: " + e.getMessage());
        }
        return response;
    }

    // ✅ Delete a post
    @DeleteMapping("/{postId}")
    public Map<String, Object> deletePost(@PathVariable Long postId) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (!postRepository.existsById(postId)) {
                response.put("error", "❌ Post not found!");
                return response;
            }
            postRepository.deleteById(postId);
            response.put("message", "🗑️ Post deleted successfully!");
        } catch (Exception e) {
            e.printStackTrace();
            response.put("error", "⚠️ Failed to delete post: " + e.getMessage());
        }
        return response;
    }
}
