package com.mvp.gsscp.config;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.model.Post;
import com.mvp.gsscp.repository.CustomerRepository;
import com.mvp.gsscp.repository.PostRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PostSeeder {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private PostRepository postRepository;

    @PostConstruct
    public void seedPosts() {
        long count = postRepository.count();

        if (count > 0) {
            System.out.println("✅ Database already contains posts. Skipping seeding.");
            return;
        }

        System.out.println("🌱 Seeding sample posts into the database...");

        
        Optional<Customer> existingUser = customerRepository.findByEmail("user@novaportal.com");

        Customer user;
        if (existingUser.isEmpty()) {
            user = new Customer();
            user.setName("Nova User");
            user.setEmail("user@novaportal.com");
            user.setPassword("password");
            user.setBio("Tech enthusiast exploring AI and innovation.");
            user.setJobRole("Software Engineer");
            user.setInterests("AI, Machine Learning, Robotics");
            user.setProgrammingLanguages("Java, Python, React");
            user.setProfileImage(null);
            customerRepository.save(user);
        } else {
            user = existingUser.get();
        }

        
        Post post1 = new Post();
        post1.setCustomer(user);
        post1.setContent("Just launched NovaPortal 🚀 — an AI-powered social learning platform!");
        post1.setImageUrl("https://cdn.dribbble.com/users/242270/screenshots/15619417/media/3ef507ad50d6de4742e1b06ab9ce91d3.png");

        Post post2 = new Post();
        post2.setCustomer(user);
        post2.setContent("What are your thoughts on using AI to make education more personalized?");
        post2.setImageUrl("https://cdn.dribbble.com/userupload/5361068/file/original-bd93c3b36a5f61622e0716235c304454.png");

        Post post3 = new Post();
        post3.setCustomer(user);
        post3.setContent("Learning React.js has been fun! NovaPortal’s new dashboard looks 🔥");
        post3.setImageUrl("https://cdn.dribbble.com/users/6191/screenshots/19846617/media/3f13de62b14b50238a2e91d437f6efb4.png");

        
        postRepository.saveAll(List.of(post1, post2, post3));

        System.out.println("✅ Post seeding complete!");
    }
}
