package com.example.iamusers.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.iamusers.model.EC2Instance;
import java.util.*;

@Repository
public interface EC2Repository extends JpaRepository<EC2Instance, Long> {
    List<EC2Instance> findByUserIdOrderByCreatedAtDesc(String userId);

    Optional<EC2Instance> findByIdAndUserId(Long id, String userId);

}
