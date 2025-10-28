package com.mvp.gsscp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mvp.gsscp.model.Customer;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email); // matches Customer.email
}
