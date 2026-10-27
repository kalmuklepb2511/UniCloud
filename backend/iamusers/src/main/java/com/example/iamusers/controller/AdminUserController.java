package com.example.iamusers.controller;

import com.example.iamusers.model.Users;
import com.example.iamusers.repository.UserRepository;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

        private final UserRepository usersRepository;
        private final PasswordEncoder passwordEncoder;

        public AdminUserController(
                        UserRepository usersRepository, PasswordEncoder passwordEncoder) {
                this.usersRepository = usersRepository;
                this.passwordEncoder = passwordEncoder;
        }

        @PostMapping
        public ResponseEntity<?> createUser(
                        @Valid @RequestBody CreateUserRequest request) {

                if (usersRepository.existsByUsername(request.username)) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Username already exists"));
                }

                if (usersRepository.existsByEmail(request.email)) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Email already exists"));
                }

                if (request.mobile != null && !request.mobile.isBlank()
                                && usersRepository.existsByMobile(request.mobile)) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Mobile already exists"));
                }

                String role = request.role == null
                                ? "USER"
                                : request.role.toUpperCase();

                if (!role.equals("USER") && !role.equals("ADMIN")) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Invalid role"));
                }

                Users user = new Users();
                user.setUsername(request.username);
                user.setEmail(request.email);
                user.setMobile(
                                request.mobile == null || request.mobile.isBlank()
                                                ? null
                                                : request.mobile);
                user.setPassword(passwordEncoder.encode(request.password));
                user.setRole(role);
                user.setStatus("ACTIVE");

                Users savedUser = usersRepository.save(user);

                return ResponseEntity.status(201)
                                .body(toSafeUserResponse(savedUser));

        }

        @PatchMapping("/{id}/status")
        public ResponseEntity<?> updateStatus(
                        @PathVariable Long id,
                        @RequestBody Map<String, String> request) {

                Users user = usersRepository.findById(id).orElse(null);

                if (user == null) {
                        return ResponseEntity.notFound().build();
                }

                String status = request.get("status");

                if (!"ACTIVE".equals(status) && !"INACTIVE".equals(status)) {
                        return ResponseEntity.badRequest()
                                        .body(Map.of("error", "Status must be ACTIVE or INACTIVE"));
                }

                user.setStatus(status);
                usersRepository.save(user);

                return ResponseEntity.ok(toSafeUserResponse(user));

        }

        public static class CreateUserRequest {

                @NotBlank
                public String username;

                @NotBlank
                @Email
                public String email;

                @NotBlank
                public String password;

                public String mobile;

                public String role;

        }

        // View all users
        @GetMapping
        public List<Map<String, Object>> getAllUsers() {

                return usersRepository.findAll()
                                .stream()
                                .map(this::toSafeUserResponse)
                                .toList();
        }

        // View one user
        @GetMapping("/{id}")
        public ResponseEntity<?> getUser(
                        @PathVariable Long id) {

                return usersRepository.findById(id)
                                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(
                                                toSafeUserResponse(user)))
                                .orElseGet(() -> ResponseEntity.notFound().build());
        }

        // Change a user's role
        @PutMapping("/{id}/role")
        public ResponseEntity<?> updateRole(
                        @PathVariable Long id,
                        @RequestBody Map<String, String> request,
                        Authentication authentication) {

                String newRole = request.get("role");

                if (!"USER".equals(newRole)
                                && !"ADMIN".equals(newRole)) {

                        return ResponseEntity.badRequest()
                                        .body(Map.of(
                                                        "error",
                                                        "Role must be USER or ADMIN"));
                }

                Users user = usersRepository.findById(id)
                                .orElse(null);

                if (user == null) {
                        return ResponseEntity.notFound().build();
                }

                // Prevent an administrator from demoting themselves.
                if (user.getUsername().equals(
                                authentication.getName())
                                && "USER".equals(newRole)) {

                        return ResponseEntity.badRequest()
                                        .body(Map.of(
                                                        "error",
                                                        "You cannot demote your own account"));
                }

                user.setRole(newRole);

                usersRepository.save(user);

                return ResponseEntity.ok(
                                toSafeUserResponse(user));
        }

        // Delete a user account
        @DeleteMapping("/{id}")
        public ResponseEntity<?> deleteUser(
                        @PathVariable Long id,
                        Authentication authentication) {

                Users user = usersRepository.findById(id)
                                .orElse(null);

                if (user == null) {
                        return ResponseEntity.notFound().build();
                }

                if (user.getUsername().equals(
                                authentication.getName())) {

                        return ResponseEntity.badRequest()
                                        .body(Map.of(
                                                        "error",
                                                        "You cannot delete your own account"));
                }

                usersRepository.delete(user);

                return ResponseEntity.ok(
                                Map.of("message",
                                                "User account deleted"));
        }

        // Never return passwords or password hashes.
        private Map<String, Object> toSafeUserResponse(
                        Users user) {

                return Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail(),
                                "mobile",
                                user.getMobile() == null
                                                ? ""
                                                : user.getMobile(),
                                "role", user.getRole(),
                                "status", user.getStatus());
        }

}
