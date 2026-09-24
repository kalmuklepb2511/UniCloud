package com.example.iamusers.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.iamusers.util.JwtUtil;
import com.example.iamusers.util.SecurityConfig;
import com.example.iamusers.service.AuthService;
import com.example.iamusers.repository.UserRepository;
import com.example.iamusers.dtos.LoginRequest;
import com.example.iamusers.dtos.RegisterRequest;
import com.example.iamusers.model.Users;
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

    public String login(LoginRequest req) {

        Users user = repo.findByUsername(req.username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!encoder.matches(req.password, user.getPassword())) {
            return "Invalid password";
        }

        return JwtUtil.generateToken(user.getUsername(), user.getRole());
    }
}