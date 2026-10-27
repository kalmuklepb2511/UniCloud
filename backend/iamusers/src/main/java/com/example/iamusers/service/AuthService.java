package com.example.iamusers.service;
import java.util.HashMap;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.iamusers.dtos.LoginRequest;
import com.example.iamusers.dtos.RegisterRequest;
import com.example.iamusers.model.Users;
import com.example.iamusers.repository.UserRepository;
import com.example.iamusers.util.JwtUtil;
import java.util.*;
@Service
public class AuthService {
private final UserRepository repo;
    private final PasswordEncoder encoder;

    public AuthService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }


    public String register(RegisterRequest req) {

        if (repo.existsByUsername(req.username))
            return "Username already exists";

        if (repo.existsByEmail(req.email))
            return "Email already exists";

        if (repo.existsByMobile(req.mobile))
            return "Mobile already exists";

        Users user = new Users();
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setMobile(req.mobile);
        user.setPassword(encoder.encode(req.password));
        user.setRole(req.role == null ? "USER" : req.role);

        repo.save(user);

        return "User registered successfully";
    }

      
    
    
public Map<String, Object> login(LoginRequest req) {

    Users user = repo.findByUsername(req.username).orElse(null);

    if (user == null) {
        throw new RuntimeException("USER_NOT_FOUND");
    }

    if (!encoder.matches(req.password, user.getPassword())) {
        throw new RuntimeException("INVALID_PASSWORD");
    }

    String token = JwtUtil.generateToken(user.getUsername(), user.getRole());

    Map<String, Object> res = new HashMap<>();
    res.put("token", token);
    res.put("username", user.getUsername());
    res.put("role", user.getRole());

    return res;
}
}