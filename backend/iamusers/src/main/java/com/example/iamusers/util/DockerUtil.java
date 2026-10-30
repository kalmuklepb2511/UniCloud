/*
 * package com.example.iamusers.util;
 * 
 * import java.io.BufferedReader;
 * import java.io.InputStreamReader;
 * import java.util.concurrent.atomic.AtomicInteger;
 * 
 * public class DockerUtil {
 * 
 * private static AtomicInteger port = new AtomicInteger(9000);
 * 
 * public static String runContainer(String jarPath, int port, String name) {
 * 
 * try {
 * ProcessBuilder pb = new ProcessBuilder(
 * "docker", "run", "-d",
 * "--name", name,
 * "--network", "unicloud-network",
 * "-p", port + ":8080",
 * 
 * "--memory=512m",
 * "--cpus=1",
 * "-e", "SPRING_DATASOURCE_URL=jdbc:mysql://unicloud-app-mysql:3306/uc_db_101",
 * "-e", "SPRING_DATASOURCE_USERNAME=uc_user_101",
 * "-e", "SPRING_DATASOURCE_PASSWORD=AppDbPassword_101!ChangeMe",
 * 
 * "-v", java.nio.file.Paths.get(jarPath)
 * .toAbsolutePath()
 * .normalize()
 * .toString() + ":/app/app.jar:ro",
 * 
 * "eclipse-temurin:17-jre",
 * "java", "-jar", "/app/app.jar"
 * 
 * );
 * // "openjdk:17",
 * // "java", "-jar", "/app/app.jar"
 * 
 * pb.redirectErrorStream(true);
 * 
 * Process process = pb.start();
 * 
 * StringBuilder output = new StringBuilder();
 * 
 * try (BufferedReader reader = new BufferedReader(
 * new InputStreamReader(process.getInputStream()))) {
 * 
 * String line;
 * 
 * while ((line = reader.readLine()) != null) {
 * output.append(line).append("\n");
 * }
 * }
 * 
 * int exitCode = process.waitFor();
 * 
 * if (exitCode != 0) {
 * throw new RuntimeException(
 * "Docker failed to start the container: " + output);
 * }
 * 
 * String containerId = output.toString().trim();
 * 
 * if (containerId.isEmpty()) {
 * throw new RuntimeException(
 * "Docker did not return a container ID.");
 * }
 * 
 * return containerId;
 * 
 * } catch (Exception e) {
 * throw new RuntimeException(
 * "Docker run failed: " + e.getMessage(), e);
 * }
 * }
 * 
 * public static String getStatusByName(String containerName) {
 * 
 * try {
 * 
 * ProcessBuilder pb = new ProcessBuilder(
 * "docker", "ps", "-a",
 * "--filter", "name=" + containerName,
 * "--format", "{{.Status}}");
 * 
 * Process process = pb.start();
 * 
 * BufferedReader reader = new BufferedReader(
 * new InputStreamReader(process.getInputStream()));
 * 
 * return reader.readLine();
 * 
 * } catch (Exception e) {
 * return "Error: " + e.getMessage();
 * }
 * }
 * 
 * public static void stop(String containerId) throws Exception {
 * }
 * 
 * public static void delete(String containerId) throws Exception {
 * Runtime.getRuntime().exec("docker rm -f " + containerId);
 * }
 * 
 * public static String status(String containerId) throws Exception {
 * Process p = Runtime.getRuntime().exec(
 * "docker ps -a --filter id=" + containerId + " --format {{.Status}}");
 * 
 * BufferedReader reader = new BufferedReader(new
 * InputStreamReader(p.getInputStream()));
 * 
 * return reader.readLine();
 * }
 * 
 * public static String logs(String containerId) throws Exception {
 * Process p = Runtime.getRuntime().exec("docker logs " + containerId);
 * 
 * BufferedReader reader = new BufferedReader(new
 * InputStreamReader(p.getInputStream()));
 * 
 * StringBuilder sb = new StringBuilder();
 * String line;
 * 
 * while ((line = reader.readLine()) != null) {
 * sb.append(line).append("\n");
 * }
 * 
 * return sb.toString();
 * }
 * 
 * // new added code today
 * public static boolean isContainerRunning(String containerId) {
 * 
 * try {
 * ProcessBuilder pb = new ProcessBuilder(
 * "docker", "inspect",
 * "--format", "{{.State.Running}}",
 * containerId);
 * 
 * pb.redirectErrorStream(true);
 * 
 * Process process = pb.start();
 * 
 * String output;
 * 
 * try (BufferedReader reader = new BufferedReader(
 * new InputStreamReader(process.getInputStream()))) {
 * 
 * output = reader.readLine();
 * }
 * 
 * int exitCode = process.waitFor();
 * 
 * return exitCode == 0 && "true".equalsIgnoreCase(output);
 * 
 * } catch (Exception e) {
 * return false;
 * }
 * }
 * 
 * public static String getContainerLogs(String containerId) {
 * 
 * try {
 * ProcessBuilder pb = new ProcessBuilder(
 * "docker", "logs", "--tail", "50", containerId);
 * 
 * pb.redirectErrorStream(true);
 * 
 * Process process = pb.start();
 * 
 * StringBuilder output = new StringBuilder();
 * 
 * try (BufferedReader reader = new BufferedReader(
 * new InputStreamReader(process.getInputStream()))) {
 * 
 * String line;
 * 
 * while ((line = reader.readLine()) != null) {
 * output.append(line).append("\n");
 * }
 * }
 * 
 * process.waitFor();
 * 
 * return output.toString();
 * 
 * } catch (Exception e) {
 * return "Unable to retrieve container logs: " + e.getMessage();
 * }
 * }
 * 
 * }
 */

//Working code 
/*package com.example.iamusers.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class DockerUtil {

    public static String runContainer(
            String jarPath,
            int hostPort,
            String containerName,
            String databaseName,
            String databaseUsername,
            String databasePassword) throws Exception {

        Path absoluteJarPath = Path.of(jarPath)
                .toAbsolutePath()
                .normalize();

        if (!absoluteJarPath.toFile().isFile()) {
            throw new IllegalArgumentException("JAR file does not exist");
        }

        List<String> command = new ArrayList<>();

        command.add("docker");
        command.add("run");
        command.add("-d");

        command.add("--name");
        command.add(containerName);

        command.add("--network");
        command.add("unicloud-network");

        command.add("-p");
        command.add(hostPort + ":8080");

        command.add("--memory=512m");
        command.add("--cpus=1");
        command.add("--pids-limit=128");

        command.add("-e");
        command.add("SPRING_DATASOURCE_URL="
                + "jdbc:mysql://unicloud-app-mysql:3306/"
                + databaseName);

        command.add("-e");
        command.add("SPRING_DATASOURCE_USERNAME="
                + databaseUsername);

        command.add("-e");
        command.add("SPRING_DATASOURCE_PASSWORD="
                + databasePassword);

        command.add("-v");
        command.add(absoluteJarPath + ":/app/app.jar:ro");

        command.add("eclipse-temurin:17-jre");

        command.add("java");
        command.add("-jar");
        command.add("/app/app.jar");

        ProcessBuilder processBuilder = new ProcessBuilder(command);
        processBuilder.redirectErrorStream(true);

        Process process = processBuilder.start();

        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append('\n');
            }
        }

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker failed to start the container: "
                            + output);
        }

        String containerId = output.toString().trim();

        if (containerId.isEmpty()) {
            throw new RuntimeException(
                    "Docker did not return a container ID");
        }

        return containerId;
    }

    public static String getStatusByName(String containerName) {
        try {
            ProcessBuilder builder = new ProcessBuilder(
                    "docker", "ps", "-a",
                    "--filter", "name=^/" + containerName + "$",
                    "--format", "{{.Status}}");

            builder.redirectErrorStream(true);

            Process process = builder.start();
            String output = readOutput(process);

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                return "Error: " + output;
            }

            return output.isBlank() ? "NOT_FOUND" : output.trim();

        } catch (Exception exception) {
            return "Error: " + exception.getMessage();
        }
    }

    public static void stop(String containerId) throws Exception {
        runDockerCommand("stop", containerId);
    }

    public static void delete(String containerId) throws Exception {
        runDockerCommand("rm", "-f", containerId);
    }

    public static String status(String containerId) throws Exception {
        return runDockerCommand(
                "inspect",
                "--format",
                "{{.State.Status}}",
                containerId).trim();
    }

    public static boolean isContainerRunning(String containerId) {
        try {
            String result = runDockerCommand(
                    "inspect",
                    "--format",
                    "{{.State.Running}}",
                    containerId);

            return "true".equalsIgnoreCase(result.trim());

        } catch (Exception exception) {
            return false;
        }
    }

    public static String logs(String containerId) throws Exception {
        return runDockerCommand("logs", containerId);
    }

    public static String getContainerLogs(String containerId) {
        try {
            return runDockerCommand(
                    "logs",
                    "--tail",
                    "50",
                    containerId);

        } catch (Exception exception) {
            return "Unable to retrieve container logs: "
                    + exception.getMessage();
        }
    }

    private static String runDockerCommand(String... arguments)
            throws Exception {

        List<String> command = new ArrayList<>();
        command.add("docker");

        for (String argument : arguments) {
            if (argument == null || argument.isBlank()) {
                throw new IllegalArgumentException(
                        "Docker command argument cannot be empty");
            }

            command.add(argument);
        }

        ProcessBuilder builder = new ProcessBuilder(command);
        builder.redirectErrorStream(true);

        Process process = builder.start();
        String output = readOutput(process);

        int exitCode = process.waitFor();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker command failed: " + output);
        }

        return output;
    }

    private static String readOutput(Process process)
            throws Exception {

        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append('\n');
            }
        }

        return output.toString();
    }
}*/

package com.example.iamusers.util;

import java.io.*;
//import java.io.BufferedReader;
//import java.io.InputStreamReader;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DockerUtil {

    // =========================================================
    // BUILD DOCKER IMAGE
    // =========================================================

    public static String buildImage(
            String projectPath,
            String imageName) throws Exception {

        Path directory = Path.of(projectPath)
                .toAbsolutePath()
                .normalize();

        if (!directory.toFile().isDirectory()) {
            throw new IllegalArgumentException(
                    "Project directory does not exist.");
        }

        List<String> command = List.of(
                "docker",
                "build",
                "--tag",
                imageName,
                directory.toString());

        return execute(command);
    }

    // =========================================================
    // RUN DOCKER CONTAINER
    // =========================================================

    public static String runContainer(
            String imageName,
            String containerName,
            int containerPort,
            Map<String, String> environmentVariables)
            throws Exception {

        if (containerPort < 1 || containerPort > 8080) {
            throw new IllegalArgumentException(
                    "Invalid container port.");
        }

        List<String> command = new ArrayList<>();

        command.add("docker");
        command.add("run");
        command.add("-d");

        command.add("--name");
        command.add(containerName);

        command.add("--network");
        command.add("unicloud-network");

        // Publish the selected container port on an
        // automatically assigned host port.
        command.add("-p");
        command.add(containerPort + "/tcp");

        command.add("--memory=512m");
        command.add("--cpus=1");
        command.add("--pids-limit=128");
        command.add("--security-opt=no-new-privileges:true");

        for (Map.Entry<String, String> entry : environmentVariables.entrySet()) {

            String key = entry.getKey();
            String value = entry.getValue();

            if (!key.matches("[A-Za-z_][A-Za-z0-9_]*")) {
                throw new IllegalArgumentException(
                        "Invalid environment variable name.");
            }

            command.add("-e");
            command.add(key + "=" + value);
        }

        command.add(imageName);

        return execute(command).trim();
    }

    // =========================================================
    // GET PUBLISHED HOST PORT
    // =========================================================

    public static int getPublishedPort(
            String containerId,
            int containerPort) throws Exception {

        String output = execute(List.of(
                "docker",
                "port",
                containerId,
                containerPort + "/tcp"));

        // Example:
        // 0.0.0.0:49153
        // [::]:49153

        for (String line : output.split("\\R")) {

            String value = line.trim();

            int separator = value.lastIndexOf(':');

            if (separator >= 0) {

                String portValue = value.substring(separator + 1);

                try {

                    int port = Integer.parseInt(portValue);

                    if (port >= 1 && port <= 65535) {
                        return port;
                    }

                } catch (NumberFormatException ignored) {
                    // Check the next mapping line.
                }
            }
        }

        throw new RuntimeException(
                "Unable to determine published Docker port. Output: "
                        + output);
    }

    // =========================================================
    // CHECK WHETHER CONTAINER IS RUNNING
    // =========================================================

    public static boolean isContainerRunning(String containerId) {

        try {

            String result = execute(List.of(
                    "docker",
                    "inspect",
                    "--format",
                    "{{.State.Running}}",
                    containerId));

            return "true".equalsIgnoreCase(result.trim());

        } catch (Exception exception) {
            return false;
        }
    }

    // =========================================================
    // GET CONTAINER STATUS
    // =========================================================

    public static String status(String containerId)
            throws Exception {

        return execute(List.of(
                "docker",
                "inspect",
                "--format",
                "{{.State.Status}}",
                containerId)).trim();
    }

    // =========================================================
    // STOP CONTAINER
    // =========================================================

    public static void stop(String containerId)
            throws Exception {

        execute(List.of(
                "docker",
                "stop",
                containerId));
    }

    // =========================================================
    // DELETE CONTAINER
    // =========================================================

    public static void delete(String containerId)
            throws Exception {

        execute(List.of(
                "docker",
                "rm",
                "-f",
                containerId));
    }

    // =========================================================
    // GET CONTAINER LOGS
    // =========================================================

    public static String logs(String containerId)
            throws Exception {

        return execute(List.of(
                "docker",
                "logs",
                "--tail",
                "200",
                containerId));
    }

    public static String getContainerLogs(String containerId) {

        try {
            return logs(containerId);

        } catch (Exception exception) {
            return "Unable to retrieve logs: "
                    + exception.getMessage();
        }
    }

    // =========================================================
    // EXECUTE DOCKER COMMAND
    // =========================================================

    private static String execute(List<String> command)
            throws Exception {

        ProcessBuilder builder = new ProcessBuilder(command);

        builder.redirectErrorStream(true);

        Process process = builder.start();

        StringBuilder output = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream()))) {

            String line;

            while ((line = reader.readLine()) != null) {
                output.append(line).append('\n');
            }
        }

        boolean completed = process.waitFor(
                120,
                java.util.concurrent.TimeUnit.SECONDS);

        if (!completed) {
            process.destroyForcibly();

            throw new RuntimeException(
                    "Docker command timed out: "
                            + String.join(" ", command));
        }

        int exitCode = process.exitValue();

        if (exitCode != 0) {
            throw new RuntimeException(
                    "Docker command failed: "
                            + String.join(" ", command)
                            + "\n"
                            + output);
        }

        return output.toString();
    }

    public static void start(String containerId) throws Exception {
        execute(List.of(
                "docker",
                "start",
                containerId));
    }

}
