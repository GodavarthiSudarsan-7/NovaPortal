package com.mvp.gsscp.repository;

import com.mvp.gsscp.model.Connection;
import com.mvp.gsscp.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    List<Connection> findByFollower(Customer follower);
    List<Connection> findByFollowing(Customer following);
    Optional<Connection> findByFollowerAndFollowing(Customer follower, Customer following);
    void deleteByFollowerAndFollowing(Customer follower, Customer following);
}
