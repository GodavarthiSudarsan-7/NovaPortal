package com.mvp.gsscp.controller;

import com.mvp.gsscp.model.Customer;
import com.mvp.gsscp.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    @Autowired
    private CustomerRepository customerRepository;

    
    @GetMapping
    public List<UserDTO> recommend(@RequestParam("email") String email) {
        Optional<Customer> opt = customerRepository.findByEmail(email);
        if (opt.isEmpty()) return Collections.emptyList();

        Customer me = opt.get();
        String mine = me.getInterests() == null ? "" : me.getInterests().toLowerCase();

       
        List<Customer> others = customerRepository.findAll().stream()
                .filter(c -> !Objects.equals(c.getEmail(), email))
                .collect(Collectors.toList());

        Map<Customer, Integer> score = new HashMap<>();
        Set<String> mineTokens = new HashSet<>(Arrays.asList((mine + " " + (me.getProgrammingLanguages()==null?"":me.getProgrammingLanguages())).split("\\W+")));
        for (Customer c : others) {
            String text = (c.getInterests()==null?"":c.getInterests()) + " " + (c.getProgrammingLanguages()==null?"":c.getProgrammingLanguages());
            Set<String> tokens = new HashSet<>(Arrays.asList(text.toLowerCase().split("\\W+")));
            tokens.retainAll(mineTokens);
            score.put(c, tokens.size());
        }

        return score.entrySet().stream()
                .sorted(Map.Entry.<Customer,Integer>comparingByValue().reversed())
                .limit(8)
                .map(e -> UserDTO.from(e.getKey()))
                .collect(Collectors.toList());
    }

    public static class UserDTO {
        public Long id;
        public String name;
        public String email;
        public String interests;
        public String programmingLanguages;
        public String profileImage;
        public static UserDTO from(Customer c) {
            UserDTO u = new UserDTO();
            u.id = c.getId();
            u.name = c.getName();
            u.email = c.getEmail();
            u.interests = c.getInterests();
            u.programmingLanguages = c.getProgrammingLanguages();
            u.profileImage = c.getProfileImage();
            return u;
        }
    }
}
