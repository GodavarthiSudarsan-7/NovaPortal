package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Customer registerCustomer(@RequestBody Customer customer) {
        return userService.registerCustomer(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return userService.getAllCustomers();
    }

    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable Long id) {
        return userService.getCustomerById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteCustomer(@PathVariable Long id) {
        userService.deleteCustomer(id);
        return "Customer deleted with id: " + id;
    }
}
