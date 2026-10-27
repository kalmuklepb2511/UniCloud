
package com.example.iamusers.controller;

import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.service.DockerService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/instances")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InstanceController {

        private final EC2Repository repository;
        private final DockerService dockerService;

        public InstanceController(
                        EC2Repository repository,
                        DockerService dockerService) {
                this.repository = repository;
                this.dockerService = dockerService;
        }

        // =========================================================
        // ADMIN: GET ALL INSTANCES
        // =========================================================

        @PreAuthorize("hasRole('ADMIN')")
        @GetMapping("/all")
        public ResponseEntity<?> getAllInstances() {

                List<EC2Instance> instances = repository.findAll();

                // Refresh Docker status for each instance
                for (EC2Instance vm : instances) {
                        try {
                                dockerService.refreshStatus(vm);
                                repository.save(vm);
                        } catch (Exception e) {
                                System.err.println(
                                                "Could not refresh Docker status for instance "
                                                                + vm.getId() + ": " + e.getMessage());
                        }
                }

                return ResponseEntity.ok(
                                repository.findAll());
        }

        // =========================================================
        // GET MY VMs
        // =========================================================

        @GetMapping("/my")
        public ResponseEntity<?> getMyInstances(
                        Authentication authentication) {

                if (authentication == null ||
                                !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body("Authentication required");
                }

                String username = authentication.getName();

                List<EC2Instance> instances = repository.findByUserIdOrderByCreatedAtDesc(username);

                // Refresh Docker status
                for (EC2Instance vm : instances) {
                        try {
                                dockerService.refreshStatus(vm);

                                repository.save(vm);
                        } catch (Exception e) {
                                // Log the error and continue returning the instance list.
                                System.err.println(
                                                "Could not refresh Docker status for instance "
                                                                + vm.getId() + ": " + e.getMessage());

                        }
                }

                return ResponseEntity.ok(instances);
        }

        // =========================================================
        // CREATE VM
        // =========================================================

        @PostMapping("/create")
        public ResponseEntity<?> createInstance(
                        @RequestBody EC2Instance request,
                        Authentication authentication) {

                if (authentication == null ||
                                !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body("Authentication required");
                }

                try {

                        String username = authentication.getName();

                        if (request.getName() == null ||
                                        request.getName().trim().isEmpty()) {

                                return ResponseEntity.badRequest()
                                                .body("VM name is required");
                        }

                        if (request.getImage() == null ||
                                        request.getImage().trim().isEmpty()) {

                                return ResponseEntity.badRequest()
                                                .body("Docker image is required");
                        }

                        if (request.getPort() == null ||
                                        request.getPort() <= 0) {

                                return ResponseEntity.badRequest()
                                                .body("Valid port is required");
                        }

                        // Prevent two VMs using same host port
                        boolean portUsed = repository.findAll()
                                        .stream()
                                        .anyMatch(vm -> vm.getPort() != null &&
                                                        vm.getPort()
                                                                        .equals(request.getPort()));

                        if (portUsed) {

                                return ResponseEntity.badRequest()
                                                .body(
                                                                "Port " +
                                                                                request.getPort() +
                                                                                " is already used");
                        }

                        EC2Instance vm = new EC2Instance();

                        vm.setName(request.getName());
                        vm.setImage(request.getImage());
                        vm.setInstanceType(
                                        request.getInstanceType());
                        vm.setPort(request.getPort());
                        vm.setUserId(username);
                        vm.setStatus("STOPPED");

                        // Actually create Docker container
                        vm = dockerService.createContainer(vm);

                        // Save VM in database
                        EC2Instance saved = repository.save(vm);

                        return ResponseEntity.ok(saved);

                } catch (Exception e) {

                        e.printStackTrace();

                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(
                                                        "VM creation failed: " +
                                                                        e.getMessage());
                }
        }

        // =========================================================
        // START
        // =========================================================
        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping("/start/{id}")
        public ResponseEntity<?> startInstance(
                        @PathVariable Long id,
                        Authentication authentication) {

                if (authentication == null ||
                                !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body("Authentication required");
                }

                try {

                        EC2Instance vm = repository.findById(id)
                                        .orElseThrow(
                                                        () -> new RuntimeException(
                                                                        "VM not found"));

                        /*
                         * if (!java.util.Objects.equals(
                         * vm.getUserId(),
                         * authentication.getName())) {
                         * 
                         * return ResponseEntity
                         * .status(HttpStatus.FORBIDDEN)
                         * .body("Access denied");
                         * }
                         */
                        boolean isAdmin = authentication.getAuthorities()
                                        .stream()
                                        .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

                        if (!isAdmin && !java.util.Objects.equals(
                                        vm.getUserId(),
                                        authentication.getName())) {

                                return ResponseEntity
                                                .status(HttpStatus.FORBIDDEN)
                                                .body("Access denied");
                        }

                        dockerService.startContainer(
                                        vm.getContainerId());

                        vm.setStatus("RUNNING");

                        return ResponseEntity.ok(
                                        repository.save(vm));

                } catch (Exception e) {

                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(
                                                        "Failed to start VM: " +
                                                                        e.getMessage());
                }
        }

        // =========================================================
        // STOP
        // =========================================================
        @PreAuthorize("hasRole('ADMIN')")
        @PostMapping("/stop/{id}")
        public ResponseEntity<?> stopInstance(
                        @PathVariable Long id,
                        Authentication authentication) {

                if (authentication == null ||
                                !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body("Authentication required");
                }

                try {

                        EC2Instance vm = repository.findById(id)
                                        .orElseThrow(
                                                        () -> new RuntimeException(
                                                                        "VM not found"));

                        /*
                         * if (!vm.getUserId()
                         * .equals(authentication.getName())) {
                         * 
                         * return ResponseEntity
                         * .status(HttpStatus.FORBIDDEN)
                         * .body("Access denied");
                         * }
                         */
                        /*
                         * if (!java.util.Objects.equals(
                         * vm.getUserId(),
                         * authentication.getName())) {
                         * 
                         * return ResponseEntity
                         * .status(HttpStatus.FORBIDDEN)
                         * .body("Access denied");
                         * }
                         */
                        boolean isAdmin = authentication.getAuthorities()
                                        .stream()
                                        .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

                        if (!isAdmin && !java.util.Objects.equals(
                                        vm.getUserId(),
                                        authentication.getName())) {

                                return ResponseEntity
                                                .status(HttpStatus.FORBIDDEN)
                                                .body("Access denied");
                        }

                        dockerService.stopContainer(
                                        vm.getContainerId());

                        vm.setStatus("STOPPED");

                        return ResponseEntity.ok(
                                        repository.save(vm));

                } catch (Exception e) {

                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(
                                                        "Failed to stop VM: " +
                                                                        e.getMessage());
                }
        }

        // =========================================================
        // DELETE
        // =========================================================
        @PreAuthorize("hasRole('ADMIN')")
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<?> deleteInstance(
                        @PathVariable Long id,
                        Authentication authentication) {

                if (authentication == null ||
                                !authentication.isAuthenticated()) {

                        return ResponseEntity
                                        .status(HttpStatus.UNAUTHORIZED)
                                        .body("Authentication required");
                }

                try {

                        EC2Instance vm = repository.findById(id)
                                        .orElseThrow(
                                                        () -> new RuntimeException(
                                                                        "VM not found"));

                        /*
                         * if (!vm.getUserId()
                         * .equals(authentication.getName())) {
                         * 
                         * return ResponseEntity
                         * .status(HttpStatus.FORBIDDEN)
                         * .body("Access denied");
                         * }
                         */
                        /*
                         * if (!java.util.Objects.equals(
                         * vm.getUserId(),
                         * authentication.getName())) {
                         * 
                         * return ResponseEntity
                         * .status(HttpStatus.FORBIDDEN)
                         * .body("Access denied");
                         * }
                         */
                        boolean isAdmin = authentication.getAuthorities()
                                        .stream()
                                        .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

                        if (!isAdmin && !java.util.Objects.equals(
                                        vm.getUserId(),
                                        authentication.getName())) {

                                return ResponseEntity
                                                .status(HttpStatus.FORBIDDEN)
                                                .body("Access denied");
                        }

                        dockerService.deleteContainer(
                                        vm.getContainerId());

                        repository.delete(vm);

                        return ResponseEntity.ok(
                                        "VM deleted successfully");

                } catch (Exception e) {

                        return ResponseEntity
                                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                        .body(
                                                        "Failed to delete VM: " +
                                                                        e.getMessage());
                }
        }
}