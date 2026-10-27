package com.example.iamusers.repository;

import com.example.iamusers.model.Deployment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeploymentRepository
        extends JpaRepository<Deployment, Long> {

    List<Deployment> findByUserIdOrderByCreatedAtDesc(
            String userId);

    Optional<Deployment> findByIdAndUserId(
            Long id,
            String userId);

    List<Deployment> findByInstanceIdAndUserIdOrderByCreatedAtDesc(
            Long instanceId,
            String userId);

    boolean existsByInstanceIdAndUserId(
            Long instanceId,
            String userId);

}
