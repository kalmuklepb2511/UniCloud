package com.example.iamusers.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.iamusers.model.EC2Instance;

import java.util.*;
public interface EC2Repository extends JpaRepository<EC2Instance, Long>{
List<EC2Instance> findByUserId(String userId);
} 