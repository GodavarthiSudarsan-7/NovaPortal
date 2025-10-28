package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/{email}")
    public Customer getCustomer(@PathVariable String email) {
        return customerRepository.findByEmail(email.toLowerCase()).orElse(null);
    }

    @PostMapping
    public Customer createCustomer(@RequestBody Customer c) {
        if (c.getEmail() == null) return null;
        Optional<Customer> existing = customerRepository.findByEmail(c.getEmail().toLowerCase());
        if (existing.isPresent()) return existing.get();

        c.setEmail(c.getEmail().toLowerCase());
        if (c.getName() == null) c.setName(c.getEmail().split("@")[0]);
        if (c.getPassword() == null) c.setPassword("temp");
        c.setCreatedAt(Instant.now().toString());
        c.setUpdatedAt(Instant.now().toString());

        return customerRepository.save(c);
    }
}
