
package com.example.iamusers.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain) throws ServletException, IOException {

                SecurityContextHolder.clearContext();

                String path = request.getRequestURI();

                // Auth endpoints don't need JWT
                if (path.startsWith("/auth")) {

                        filterChain.doFilter(
                                        request,
                                        response);

                        return;
                }

                // Allow CORS preflight
                if ("OPTIONS".equalsIgnoreCase(
                                request.getMethod())) {

                        filterChain.doFilter(
                                        request,
                                        response);

                        return;
                }

                String header = request.getHeader("Authorization");

                // No token
                if (header == null ||
                                !header.startsWith("Bearer ")) {

                        filterChain.doFilter(
                                        request,
                                        response);

                        return;
                }

                try {

                        String token = header.substring(7).trim();

                        String username = JwtUtil.extractUsername(token);

                        String role = JwtUtil.extractRole(token);

                        if (username == null ||
                                        username.isBlank()) {

                                response.setStatus(
                                                HttpServletResponse.SC_UNAUTHORIZED);

                                response.getWriter()
                                                .write("Invalid token");

                                return;
                        }

                        if (role == null ||
                                        role.isBlank()) {

                                role = "ROLE_USER";
                        }

                        if (!role.startsWith("ROLE_")) {

                                role = "ROLE_" +
                                                role.toUpperCase();
                        }

                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                        username,
                                        null,
                                        List.of(
                                                        new SimpleGrantedAuthority(
                                                                        role)));

                        SecurityContextHolder
                                        .getContext()
                                        .setAuthentication(
                                                        authentication);

                        filterChain.doFilter(
                                        request,
                                        response);

                } catch (Exception e) {

                        SecurityContextHolder
                                        .clearContext();

                        response.setStatus(
                                        HttpServletResponse.SC_UNAUTHORIZED);

                        response.setContentType(
                                        "application/json");

                        response.getWriter()
                                        .write(
                                                        "{\"error\":\"Invalid or expired token\"}");
                }
        }
}