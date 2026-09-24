package com.example.iamusers.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class RegisterRequest {
        @NotBlank
    public String username;

    @Email
    public String email;

    @Pattern(regexp = "^[0-9]{10}$")
    public String mobile;

    @NotBlank
    @Size(min = 6, message = "Password must be 6+ characters")
    public String password;

    public String role;

}
