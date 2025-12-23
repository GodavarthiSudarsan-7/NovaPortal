package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class ProfileController {

    @Autowired
    private CustomerRepository customerRepository;

   
    @GetMapping
    public List<Customer> getAllUsers() {
        return customerRepository.findAll();
    }

    @GetMapping("/{email}")
    public Optional<Customer> getProfile(@PathVariable String email) {
        try {
            String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
            return customerRepository.findByEmail(decodedEmail);
        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }


    @PutMapping("/{email}")
    public String updateProfile(@PathVariable String email, @RequestBody Customer updatedUser) {
        try {
            String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
            Optional<Customer> existing = customerRepository.findByEmail(decodedEmail);

            if (existing.isPresent()) {
                Customer user = existing.get();

              
                if (updatedUser.getName() != null) user.setName(updatedUser.getName());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty())
                    user.setPassword(updatedUser.getPassword());
                if (updatedUser.getJobRole() != null) user.setJobRole(updatedUser.getJobRole());
                if (updatedUser.getProgrammingLanguages() != null)
                    user.setProgrammingLanguages(updatedUser.getProgrammingLanguages());
                if (updatedUser.getInterests() != null) user.setInterests(updatedUser.getInterests());
                if (updatedUser.getBio() != null) user.setBio(updatedUser.getBio());

               
                if (updatedUser.getCollege() != null) user.setCollege(updatedUser.getCollege());
                if (updatedUser.getDegree() != null) user.setDegree(updatedUser.getDegree());
                if (updatedUser.getSkills() != null) user.setSkills(updatedUser.getSkills());
                if (updatedUser.getLinkedin() != null) user.setLinkedin(updatedUser.getLinkedin());
                if (updatedUser.getGithub() != null) user.setGithub(updatedUser.getGithub());
                if (updatedUser.getResume() != null) user.setResume(updatedUser.getResume());

          
                if (updatedUser.getProfileImage() != null) {
                    if (updatedUser.getProfileImage().equalsIgnoreCase("DELETE_IMAGE")) {
                     
                        user.setProfileImage(null);
                    } else {
                        user.setProfileImage(updatedUser.getProfileImage());
                    }
                }

                customerRepository.save(user);
                return "✅ Profile updated successfully!";
            } else {
                return "⚠️ User not found!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error updating profile: " + e.getMessage();
        }
    }

    @DeleteMapping("/{email}")
    public String deleteUser(@PathVariable String email) {
        try {
            String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
            Optional<Customer> existing = customerRepository.findByEmail(decodedEmail);

            if (existing.isPresent()) {
                customerRepository.delete(existing.get());
                return "🗑️ User profile deleted successfully!";
            } else {
                return "⚠️ User not found!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error deleting user: " + e.getMessage();
        }
    }

   
    @DeleteMapping("/{email}/image")
    public String deleteProfileImage(@PathVariable String email) {
        try {
            String decodedEmail = URLDecoder.decode(email, StandardCharsets.UTF_8);
            Optional<Customer> existing = customerRepository.findByEmail(decodedEmail);

            if (existing.isPresent()) {
                Customer user = existing.get();
                user.setProfileImage(null);
                customerRepository.save(user);
                return "🖼️ Profile image removed successfully!";
            } else {
                return "⚠️ User not found!";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error removing profile image: " + e.getMessage();
        }
    }
}
