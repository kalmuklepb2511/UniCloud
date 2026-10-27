package com.example.iamusers.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.iamusers.dtos.LoginRequest;
import com.example.iamusers.dtos.RegisterRequest;
import com.example.iamusers.model.Users;
import com.example.iamusers.repository.UserRepository;
import com.example.iamusers.service.AuthService;
import com.example.iamusers.util.JwtUtil;

import jakarta.validation.Valid;

    @RestController
@RequestMapping("/auth")
//@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService service;

@Autowired 
private UserRepository repo;


    @PostMapping("/register")
    public String register(@Valid @RequestBody RegisterRequest req) {
        return service.register(req);
    }

   
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
    try {
        return ResponseEntity.ok(service.login(req));
    } catch (Exception e) {
        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
}

