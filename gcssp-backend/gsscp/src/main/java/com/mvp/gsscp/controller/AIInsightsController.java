package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/ai")
public class AIInsightsController {

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ Simple AI knowledge base
    private static final Map<String, Map<String, Object>> KNOWLEDGE_BASE = new HashMap<>();

    static {
        Map<String, Object> python = new HashMap<>();
        python.put("relatedTechnologies", Arrays.asList("Flask", "Django", "NumPy", "Pandas", "TensorFlow"));
        python.put("suggestedCommunities", Arrays.asList("Data Science", "Machine Learning", "Web Dev", "Automation"));
        python.put("recommendedRoles", Arrays.asList("Python Developer", "Data Analyst", "AI Engineer"));
        KNOWLEDGE_BASE.put("python", python);

        Map<String, Object> java = new HashMap<>();
        java.put("relatedTechnologies", Arrays.asList("Spring Boot", "Hibernate", "Maven", "JPA"));
        java.put("suggestedCommunities", Arrays.asList("Backend Developers", "Enterprise Apps", "API Builders"));
        java.put("recommendedRoles", Arrays.asList("Java Developer", "Backend Engineer"));
        KNOWLEDGE_BASE.put("java", java);

        Map<String, Object> react = new HashMap<>();
        react.put("relatedTechnologies", Arrays.asList("Next.js", "Node.js", "Tailwind", "Redux"));
        react.put("suggestedCommunities", Arrays.asList("Frontend Developers", "UI/UX Enthusiasts"));
        react.put("recommendedRoles", Arrays.asList("Frontend Developer", "React Engineer"));
        KNOWLEDGE_BASE.put("react", react);

        Map<String, Object> ai = new HashMap<>();
        ai.put("relatedTechnologies", Arrays.asList("TensorFlow", "Keras", "OpenAI API", "PyTorch"));
        ai.put("suggestedCommunities", Arrays.asList("AI Researchers", "Data Scientists", "ML Enthusiasts"));
        ai.put("recommendedRoles", Arrays.asList("AI Engineer", "ML Researcher"));
        KNOWLEDGE_BASE.put("ai", ai);

        Map<String, Object> web = new HashMap<>();
        web.put("relatedTechnologies", Arrays.asList("HTML", "CSS", "JavaScript", "React", "Node.js"));
        web.put("suggestedCommunities", Arrays.asList("Web Developers", "UI Designers"));
        web.put("recommendedRoles", Arrays.asList("Full Stack Developer", "Frontend Engineer"));
        KNOWLEDGE_BASE.put("web", web);
    }

    // ✅ Generate AI insights + related users
    @GetMapping("/insights")
    public Map<String, Object> getInsights(@RequestParam String keyword) {
        final String searchKeyword = keyword.toLowerCase(); // must be final for lambda
        Map<String, Object> data = new HashMap<>(KNOWLEDGE_BASE.getOrDefault(searchKeyword, new HashMap<>()));

        if (data.isEmpty()) {
            data.put("relatedTechnologies", List.of("No specific data found."));
            data.put("suggestedCommunities", List.of("General Tech Community"));
            data.put("recommendedRoles", List.of("Learner", "Contributor"));
        }

        // ✅ Find related users (based on interests or programming languages)
        List<Map<String, Object>> relatedUsers = customerRepository.findAll().stream()
                .filter(c -> {
                    String combined = ((c.getInterests() == null ? "" : c.getInterests()) + " " +
                            (c.getProgrammingLanguages() == null ? "" : c.getProgrammingLanguages())).toLowerCase();
                    return combined.contains(searchKeyword);
                })
                .map(c -> {
                    Map<String, Object> user = new HashMap<>();
                    user.put("id", c.getId());
                    user.put("name", c.getName());
                    user.put("email", c.getEmail());
                    user.put("profileImage", c.getProfileImage());
                    user.put("interests", c.getInterests());
                    user.put("languages", c.getProgrammingLanguages());
                    return user;
                })
                .limit(10)
                .collect(Collectors.toList());

        data.put("relatedUsers", relatedUsers);
        data.put("keyword", searchKeyword);
        data.put("message", "AI insights generated successfully for " + searchKeyword);

        return data;
    }
}
