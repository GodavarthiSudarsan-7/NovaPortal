package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/explore")
public class ExploreController {

    @Autowired
    private CustomerRepository customerRepository;

    // Get all users (excluding password)
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return customerRepository.findAll().stream()
                .map(UserDTO::from)
                .collect(Collectors.toList());
    }

    // Search users by name, email, interest, or language
    @GetMapping("/search")
    public List<UserDTO> search(@RequestParam("q") String q) {
        String query = q.toLowerCase();
        return customerRepository.findAll().stream()
                .filter(c ->
                        (c.getName() != null && c.getName().toLowerCase().contains(query)) ||
                        (c.getEmail() != null && c.getEmail().toLowerCase().contains(query)) ||
                        (c.getInterests() != null && c.getInterests().toLowerCase().contains(query)) ||
                        (c.getProgrammingLanguages() != null && c.getProgrammingLanguages().toLowerCase().contains(query))
                )
                .map(UserDTO::from)
                .collect(Collectors.toList());
    }

    // DTO to prevent exposing password
    public static class UserDTO {
        public Long id;
        public String name;
        public String email;
        public String interests;
        public String jobRole;
        public String programmingLanguages;
        public String profileImage;

        public static UserDTO from(Customer c) {
            UserDTO dto = new UserDTO();
            dto.id = c.getId();
            dto.name = c.getName();
            dto.email = c.getEmail();
            dto.interests = c.getInterests();
            dto.jobRole = c.getJobRole();
            dto.programmingLanguages = c.getProgrammingLanguages();
            dto.profileImage = c.getProfileImage();
            return dto;
        }
    }
}
