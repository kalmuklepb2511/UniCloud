package com.example.iamusers.dtos;

import com.example.iamusers.model.Users;

public class UserResponse {

    private Long id;
    private String username;
    private String email;
    private String mobile;
    private String role;
    private String status;

    public UserResponse(Users user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.mobile = user.getMobile();
        this.role = user.getRole();
        // this.status = user.getStatus();
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getMobile() {
        return mobile;
    }

    public String getRole() {
        return role;
    }

    /*
     * public String getStatus() {
     * return status;
     * }
     */

}
