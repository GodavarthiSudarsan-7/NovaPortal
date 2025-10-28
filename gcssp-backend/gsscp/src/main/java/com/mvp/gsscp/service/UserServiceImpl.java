package com.mvp.gsscp.service;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public Customer registerCustomer(Customer customer) {
        return userRepository.save(customer);
    }

    @Override
    public boolean validateCustomer(String email, String password) {
        Optional<Customer> c = userRepository.findByEmail(email);
        return c.isPresent() && c.get().getPassword().equals(password);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return userRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteCustomer(Long id) {
        userRepository.deleteById(id);
    }
}
