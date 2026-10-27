package com.example.iamusers.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "application_databases", uniqueConstraints = {
        @UniqueConstraint(name = "uk_application_database_deployment", columnNames = "deployment_id"),
        @UniqueConstraint(name = "uk_application_database_name", columnNames = "database_name"),
        @UniqueConstraint(name = "uk_application_database_username", columnNames = "database_username")
})
public class ApplicationDatabase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "deployment_id", nullable = false)
    private Long deploymentId;

    @Column(name = "database_name", nullable = false, unique = true)
    private String databaseName;

    @Column(name = "database_username", nullable = false, unique = true)
    private String databaseUsername;

    /*
     * Store a reference to a secret manager or secure credential store.
     * Do not store the actual database password in this entity.
     */
    @Column(name = "secret_reference")
    private String secretReference;

    @Column(nullable = false)
    private String status = "PROVISIONING";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public ApplicationDatabase() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(Long deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public String getDatabaseUsername() {
        return databaseUsername;
    }

    public void setDatabaseUsername(String databaseUsername) {
        this.databaseUsername = databaseUsername;
    }

    public String getSecretReference() {
        return secretReference;
    }

    public void setSecretReference(String secretReference) {
        this.secretReference = secretReference;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}