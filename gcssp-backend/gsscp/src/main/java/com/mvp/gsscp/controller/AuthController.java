package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")  // Allow React frontend access
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private CustomerRepository customerRepository;

    // 🧩 LOGIN ENDPOINT
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String password = request.get("password");

        Optional<Customer> customerOpt = customerRepository.findByEmail(email);

        if (customerOpt.isPresent() && customerOpt.get().getPassword().equals(password)) {
            Customer customer = customerOpt.get();
            response.put("success", true);
            response.put("email", customer.getEmail());
            response.put("name", customer.getName());
            response.put("message", "Login successful!");
        } else {
            response.put("success", false);
            response.put("error", "Invalid email or password.");
        }

        return response;
    }

    // 🧩 REGISTER ENDPOINT
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        String email = request.get("email");
        String password = request.get("password");
        String name = request.get("name");

        // Check if email already exists
        Optional<Customer> existingUser = customerRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            response.put("success", false);
            response.put("error", "Email already registered. Please login.");
            return response;
        }

        // Create new customer
        Customer newCustomer = new Customer();
        newCustomer.setEmail(email);
        newCustomer.setPassword(password);
        newCustomer.setName(name);
        newCustomer.setCreatedAt(new Date().toString());
        newCustomer.setUpdatedAt(new Date().toString());
        customerRepository.save(newCustomer);

        response.put("success", true);
        response.put("message", "Registration successful!");
        response.put("email", newCustomer.getEmail());
        response.put("name", newCustomer.getName());

        return response;
    }

    // 🧩 FETCH USER PROFILE
    @GetMapping("/profile/{email}")
    public Map<String, Object> getProfile(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);

        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            response.put("success", true);
            response.put("data", customer);
        } else {
            response.put("success", false);
            response.put("error", "User not found.");
        }

        return response;
    }

    // 🧩 TEST CONNECTION
    @GetMapping("/ping")
    public String ping() {
        return "✅ AuthController is active!";
    }
}
