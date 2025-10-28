package com.mvp.gsscp.model;

import jakarta.persistence.*;

@Entity
@Table(name = "connections",
       uniqueConstraints = {@UniqueConstraint(columnNames = {"follower_id", "following_id"})})
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // who follows
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private Customer follower;

    // who is followed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private Customer following;

    public Connection() {}

    public Connection(Customer follower, Customer following) {
        this.follower = follower;
        this.following = following;
    }

    public Long getId() { return id; }

    public Customer getFollower() { return follower; }
    public void setFollower(Customer follower) { this.follower = follower; }

    public Customer getFollowing() { return following; }
    public void setFollowing(Customer following) { this.following = following; }
}
