package com.example.iamusers.service;

import com.example.iamusers.model.EC2Instance;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class DockerService {

    // =========================================================
    // CREATE DOCKER CONTAINER
    // =========================================================

    public EC2Instance createContainer(EC2Instance vm) {

        if (vm.getName() == null || vm.getName().trim().isEmpty()) {
            throw new RuntimeException("Container name is required");
        }

        if (vm.getImage() == null || vm.getImage().trim().isEmpty()) {
            throw new RuntimeException("Docker image is required");
        }

        if (vm.getPort() == null || vm.getPort() < 1 || vm.getPort() > 65535) {
            throw new RuntimeException("Valid port is required");
        }

        // Generate a Docker-safe, unique container name.
        String containerName = "unicloud-" + java.util.UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);

        try {

            // Create a stopped container.
            // The controller currently sets the VM status to STOPPED.
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "create",
                    "--name", containerName,
                    "-p", vm.getPort() + ":8080",
                    "--memory=512m",
                    "--cpus=1",
                    vm.getImage());

            pb.redirectErrorStream(true);

            String output = executeCommand(pb);

            // Docker create returns the container ID.
            String containerId = output.trim().split("\\s+")[0];

            if (containerId.isEmpty() || containerId.length() < 12) {
                throw new RuntimeException(
                        "Docker did not return a valid container ID. Output: " + output);
            }

            vm.setContainerId(containerId);
            vm.setContainerName(containerName);
            vm.setStatus("STOPPED");

            return vm;

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to create Docker container: " + e.getMessage(), e);
        }
    }

    // =========================================================
    // START CONTAINER
    // =========================================================

    public void startContainer(String containerId) {

        validateContainerId(containerId);

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "start", containerId);

            pb.redirectErrorStream(true);

            executeCommand(pb);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to start Docker container: " + e.getMessage(), e);
        }
    }

    // =========================================================
    // STOP CONTAINER
    // =========================================================

    public void stopContainer(String containerId) {

        validateContainerId(containerId);

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "stop", "--time", "10", containerId);

            pb.redirectErrorStream(true);

            executeCommand(pb);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to stop Docker container: " + e.getMessage(), e);
        }
    }

    // =========================================================
    // DELETE CONTAINER
    // =========================================================

    public void deleteContainer(String containerId) {

        validateContainerId(containerId);

        try {
            // -f removes a running or stopped container.
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "rm", "-f", containerId);

            pb.redirectErrorStream(true);

            executeCommand(pb);

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to delete Docker container: " + e.getMessage(), e);
        }
    }

    // =========================================================
    // REFRESH DOCKER STATUS
    // =========================================================

    public void refreshStatus(EC2Instance vm) {

        if (vm == null || vm.getContainerId() == null
                || vm.getContainerId().trim().isEmpty()) {
            if (vm != null) {
                vm.setStatus("UNKNOWN");
            }
            return;
        }

        try {
            ProcessBuilder pb = new ProcessBuilder(
                    "docker", "inspect",
                    "--format", "{{.State.Status}}",
                    vm.getContainerId());

            pb.redirectErrorStream(true);

            String output = executeCommand(pb).trim();

            switch (output.toLowerCase()) {
                case "running":
                    vm.setStatus("RUNNING");
                    break;

                case "created":
                case "exited":
                case "stopped":
                    vm.setStatus("STOPPED");
                    break;

                case "restarting":
                    vm.setStatus("RESTARTING");
                    break;

                case "paused":
                    vm.setStatus("PAUSED");
                    break;

                case "dead":
                    vm.setStatus("ERROR");
                    break;

                default:
                    vm.setStatus("UNKNOWN");
                    break;
            }

        } catch (Exception e) {
            // A missing container may have been deleted outside UniCloud.
            vm.setStatus("UNKNOWN");
            System.err.println(
                    "Could not refresh container status: " + e.getMessage());
        }
    }

    // =========================================================
    // EXECUTE DOCKER COMMAND
    // =========================================================

    private String executeCommand(ProcessBuilder pb)
            throws IOException, InterruptedException {

        Process process = pb.start();

        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append(System.lineSeparator());
            }
        }

        boolean finished = process.waitFor(60, TimeUnit.SECONDS);

        if (!finished) {
            process.destroyForcibly();
            throw new RuntimeException("Docker command timed out");
        }

        int exitCode = process.exitValue();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker command failed (exit code "
                            + exitCode + "): " + output.toString().trim());
        }

        return output.toString();
    }

    // =========================================================
    // VALIDATE CONTAINER ID
    // =========================================================

    private void validateContainerId(String containerId) {

        if (containerId == null
                || !containerId.matches("[a-fA-F0-9]{12,64}")) {
            throw new IllegalArgumentException(
                    "Invalid Docker container ID");
        }
    }
}