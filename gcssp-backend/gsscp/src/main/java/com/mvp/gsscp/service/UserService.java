package com.mvp.gsscp.service;

import com.mvp.gsscp.model.Customer;
import java.util.List;

public interface UserService {
    Customer registerCustomer(Customer customer);
    boolean validateCustomer(String email, String password);
    List<Customer> getAllCustomers();
    Customer getCustomerById(Long id);
    void deleteCustomer(Long id);
}
