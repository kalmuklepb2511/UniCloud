package com.example.iamusers.controller;

import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.service.DockerService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/instances")
@PreAuthorize("hasRole('ADMIN')")
public class AdminInstanceController {

    private final EC2Repository repository;
    private final DockerService dockerService;

    public AdminInstanceController(
            EC2Repository repository,
            DockerService dockerService) {

        this.repository = repository;
        this.dockerService = dockerService;
    }

    // View all instances belonging to all users.
    @GetMapping
    public List<EC2Instance> getAllInstances() {

        List<EC2Instance> instances = repository.findAll();

        for (EC2Instance instance : instances) {
            try {
                dockerService.refreshStatus(instance);
                repository.save(instance);
            } catch (Exception e) {
                System.err.println(
                        "Could not refresh instance "
                                + instance.getId()
                                + ": "
                                + e.getMessage());
            }
        }

        return instances;
    }

    // Start any instance.
    @PostMapping("/{id}/start")
    public ResponseEntity<?> startInstance(
            @PathVariable Long id) {

        EC2Instance instance = findInstance(id);

        if (instance == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            dockerService.startContainer(
                    instance.getContainerId());

            instance.setStatus("RUNNING");

            return ResponseEntity.ok(
                    repository.save(instance));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to start instance"));
        }
    }

    // Stop any instance.
    @PostMapping("/{id}/stop")
    public ResponseEntity<?> stopInstance(
            @PathVariable Long id) {

        EC2Instance instance = findInstance(id);

        if (instance == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            dockerService.stopContainer(
                    instance.getContainerId());

            instance.setStatus("STOPPED");

            return ResponseEntity.ok(
                    repository.save(instance));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to stop instance"));
        }
    }

    // Restart any instance.
    @PostMapping("/{id}/restart")
    public ResponseEntity<?> restartInstance(
            @PathVariable Long id) {

        EC2Instance instance = findInstance(id);

        if (instance == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            dockerService.stopContainer(
                    instance.getContainerId());

            dockerService.startContainer(
                    instance.getContainerId());

            instance.setStatus("RUNNING");

            return ResponseEntity.ok(
                    repository.save(instance));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to restart instance"));
        }
    }

    // Delete any instance.
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInstance(
            @PathVariable Long id) {

        EC2Instance instance = findInstance(id);

        if (instance == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            dockerService.deleteContainer(
                    instance.getContainerId());

            repository.delete(instance);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Instance deleted successfully"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of(
                            "error",
                            "Failed to delete instance"));
        }
    }

    private EC2Instance findInstance(Long id) {
        return repository.findById(id).orElse(null);
    }

}
