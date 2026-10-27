package com.example.iamusers.repository;

import com.example.iamusers.model.ApplicationDatabase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ApplicationDatabaseRepository
        extends JpaRepository<ApplicationDatabase, Long> {

    Optional<ApplicationDatabase> findByDeploymentId(Long deploymentId);

    boolean existsByDatabaseName(String databaseName);

    boolean existsByDatabaseUsername(String databaseUsername);
}