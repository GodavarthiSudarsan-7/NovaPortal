package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private CustomerRepository customerRepository;

    // ✅ Get all users (for Explore page)
    @GetMapping
    public List<Customer> getAllUsers() {
        return customerRepository.findAll();
    }

    // ✅ Get profile by email
    @GetMapping("/{email}")
    public Optional<Customer> getProfile(@PathVariable String email) {
        return customerRepository.findByEmail(email);
    }

    // ✅ Update profile details (including image, bio, etc.)
    @PutMapping("/{email}")
    public String updateProfile(@PathVariable String email, @RequestBody Customer updatedUser) {
        Optional<Customer> existing = customerRepository.findByEmail(email);

        if (existing.isPresent()) {
            Customer user = existing.get();

            user.setName(updatedUser.getName());
            user.setPassword(updatedUser.getPassword());
            user.setJobRole(updatedUser.getJobRole());
            user.setProgrammingLanguages(updatedUser.getProgrammingLanguages());
            user.setInterests(updatedUser.getInterests());
            user.setBio(updatedUser.getBio());
            user.setProfileImage(updatedUser.getProfileImage());

            customerRepository.save(user);
            return "✅ Profile updated successfully!";
        } else {
            return "⚠️ User not found!";
        }
    }
}
