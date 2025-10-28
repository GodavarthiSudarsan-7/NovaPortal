package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Connection;
import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.ConnectionRepository;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // followerEmail and followingId passed in body
    public static class ConnectRequest {
        public String followerEmail;
        public Long followingId;
    }

    @PostMapping("/follow")
    public String follow(@RequestBody ConnectRequest req) {
        Customer follower = customerRepository.findByEmail(req.followerEmail)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        Customer following = customerRepository.findById(req.followingId)
                .orElseThrow(() -> new RuntimeException("Following not found"));

        if (connectionRepository.findByFollowerAndFollowing(follower, following).isPresent()) {
            return "Already following";
        }
        Connection c = new Connection(follower, following);
        connectionRepository.save(c);
        return "Followed";
    }

    @PostMapping("/unfollow")
    public String unfollow(@RequestBody ConnectRequest req) {
        Customer follower = customerRepository.findByEmail(req.followerEmail)
                .orElseThrow(() -> new RuntimeException("Follower not found"));
        Customer following = customerRepository.findById(req.followingId)
                .orElseThrow(() -> new RuntimeException("Following not found"));

        connectionRepository.findByFollowerAndFollowing(follower, following)
                .ifPresent(connectionRepository::delete);
        return "Unfollowed";
    }

    @GetMapping("/following/{email}")
    public List<UserCtrlDTO> getFollowing(@PathVariable String email) {
        Customer follower = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findByFollower(follower).stream()
                .map(conn -> UserCtrlDTO.from(conn.getFollowing()))
                .collect(Collectors.toList());
    }

    @GetMapping("/followers/{email}")
    public List<UserCtrlDTO> getFollowers(@PathVariable String email) {
        Customer following = customerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return connectionRepository.findByFollowing(following).stream()
                .map(conn -> UserCtrlDTO.from(conn.getFollower()))
                .collect(Collectors.toList());
    }

    static class UserCtrlDTO {
        public Long id;
        public String name;
        public String email;
        public String profileImage;
        public static UserCtrlDTO from(Customer c) {
            UserCtrlDTO d = new UserCtrlDTO();
            d.id = c.getId();
            d.name = c.getName();
            d.email = c.getEmail();
            d.profileImage = c.getProfileImage();
            return d;
        }
    }
}
