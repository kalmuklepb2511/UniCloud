/*package com.example.iamusers.controller;

import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.util.DockerUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/deployments")
public class DeploymentController {

    private final EC2Repository repository;

    @Value("${app.deployment.upload-dir}")
    private String uploadDir;

    public DeploymentController(EC2Repository repository) {
        this.repository = repository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadJar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please upload a JAR file"));
        }

        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Application name is required"));
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null ||
                !originalFilename.toLowerCase().endsWith(".jar")) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only JAR files are allowed"));
        }

        String containerName = "unicloud-" + UUID.randomUUID()
                .toString().replace("-", "").substring(0, 12);

        Path savedJar = null;
        String containerId = null;

        try {
            Path uploadDirectory = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadDirectory);

            savedJar = uploadDirectory.resolve(
                    UUID.randomUUID() + ".jar").normalize();

            if (!savedJar.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file path"));
            }

            Files.copy(
                    file.getInputStream(),
                    savedJar,
                    StandardCopyOption.REPLACE_EXISTING);

            // Allocate a port using a proper allocator in the next iteration.
            int port = 9000 + new java.util.Random().nextInt(1000);

            containerId = DockerUtil.runContainer(
                    savedJar.toString(),
                    port,
                    containerName);

            // Wait up to 30 seconds for the container to start.
            boolean running = false;

            for (int i = 0; i < 30; i++) {

                if (DockerUtil.isContainerRunning(containerId)) {
                    running = true;
                    break;
                }

                Thread.sleep(1000);
            }

            if (!running) {

                String logs = DockerUtil.getContainerLogs(containerId);

                try {
                    DockerUtil.delete(containerId);
                } catch (Exception ignored) {
                }

                Files.deleteIfExists(savedJar);

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "error", "Application failed to start",
                                "logs", logs));
            }

            EC2Instance instance = new EC2Instance();

            instance.setName(name.trim());
            instance.setContainerId(containerId);
            instance.setContainerName(containerName);
            instance.setPort(port);
            instance.setUserId(authentication.getName());
            instance.setImage("uploaded-jar");
            instance.setInstanceType("custom");
            instance.setStatus("RUNNING");

            EC2Instance savedInstance = repository.save(instance);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Container created",
                            "instanceId", savedInstance.getId(),
                            "containerId", containerId,
                            "containerName", containerName,
                            "port", port,
                            "url", "http://localhost:" + port));

        } catch (Exception e) {

            // Avoid leaving a container behind if deployment or DB saving fails.
            if (containerId != null) {
                try {
                    DockerUtil.delete(containerId);
                } catch (Exception ignored) {
                    // Preserve the original deployment error.
                }
            }

            if (savedJar != null) {
                try {
                    Files.deleteIfExists(savedJar);
                } catch (IOException ignored) {
                    // Preserve the original deployment error.
                }
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Deployment failed",
                            "details", String.valueOf(e.getMessage())));
        }
    }
}
*/

//Working code
/* 
package com.example.iamusers.controller;

import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.service.DatabaseProvisioningService;
import com.example.iamusers.service.DatabaseProvisioningService.ProvisionedDatabase;
import com.example.iamusers.util.DockerUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/deployments")
public class DeploymentController {

    private final EC2Repository repository;
    private final DatabaseProvisioningService databaseProvisioningService;

    @Value("${app.deployment.upload-dir}")
    private String uploadDir;

    public DeploymentController(
            EC2Repository repository,
            DatabaseProvisioningService databaseProvisioningService) {

        this.repository = repository;
        this.databaseProvisioningService = databaseProvisioningService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadJar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(
                        String.valueOf(authentication.getPrincipal()))) {

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required"));
        }

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Please upload a JAR file"));
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null
                || !originalFilename.toLowerCase().endsWith(".jar")) {

            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only JAR files are allowed"));
        }

        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Application name is required"));
        }

        String containerName = "unicloud-"
                + UUID.randomUUID().toString()
                        .replace("-", "")
                        .substring(0, 12);

        Path savedJar = null;
        String containerId = null;
        ProvisionedDatabase provisionedDatabase = null;

        try {
            Path uploadDirectory = Paths.get(uploadDir)
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadDirectory);

            savedJar = uploadDirectory.resolve(
                    UUID.randomUUID() + ".jar").normalize();

            if (!savedJar.startsWith(uploadDirectory)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid file path"));
            }

            Files.copy(
                    file.getInputStream(),
                    savedJar,
                    StandardCopyOption.REPLACE_EXISTING);

            // Step 1: Create a unique database and database user.
            provisionedDatabase = databaseProvisioningService.createDatabase();

            // Step 2: Choose a candidate host port.
            // This is only a temporary allocator; it does not guarantee
            // the port is free. Replace with a proper port allocator.
            int port = ThreadLocalRandom.current()
                    .nextInt(9000, 10000);

            // Step 3: Start the container with its own DB credentials.
            containerId = DockerUtil.runContainer(
                    savedJar.toString(),
                    port,
                    containerName,
                    provisionedDatabase.databaseName(),
                    provisionedDatabase.username(),
                    provisionedDatabase.password());

            // Step 4: Wait for the container to stay running.
            boolean running = false;

            for (int i = 0; i < 30; i++) {
                if (DockerUtil.isContainerRunning(containerId)) {
                    running = true;
                    break;
                }

                Thread.sleep(1000);
            }

            if (!running) {
                String logs = DockerUtil.getContainerLogs(containerId);

                try {
                    DockerUtil.delete(containerId);
                } catch (Exception ignored) {
                }

                containerId = null;

                databaseProvisioningService.deleteDatabase(
                        provisionedDatabase);

                provisionedDatabase = null;

                Files.deleteIfExists(savedJar);
                savedJar = null;

                return ResponseEntity.status(
                        HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "error", "Application failed to start",
                                "logs", logs));
            }

            // Step 5: Save the deployment record.
            EC2Instance instance = new EC2Instance();

            instance.setName(name.trim());
            instance.setContainerId(containerId);
            instance.setContainerName(containerName);
            instance.setPort(port);
            instance.setUserId(authentication.getName());
            instance.setImage("uploaded-jar");
            instance.setInstanceType("custom");
            instance.setStatus("RUNNING");

            EC2Instance savedInstance = repository.save(instance);

            // Never return the generated database password to the client.
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Container created",
                            "instanceId", savedInstance.getId(),
                            "containerId", containerId,
                            "containerName", containerName,
                            "databaseName",
                            provisionedDatabase.databaseName(),
                            "databaseUsername",
                            provisionedDatabase.username(),
                            "port", port,
                            "url", "http://localhost:" + port));

        } catch (Exception exception) {

            // Best-effort cleanup for failures.
            if (containerId != null) {
                try {
                    DockerUtil.delete(containerId);
                } catch (Exception ignored) {
                }
            }

            if (provisionedDatabase != null) {
                try {
                    databaseProvisioningService.deleteDatabase(
                            provisionedDatabase);
                } catch (Exception ignored) {
                }
            }

            if (savedJar != null) {
                try {
                    Files.deleteIfExists(savedJar);
                } catch (IOException ignored) {
                }
            }

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error", "Deployment failed",
                            "details", String.valueOf(
                                    exception.getMessage())));
        }
    }
}*/
/* 
package com.example.iamusers.controller;

import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.service.ProjectDetector;
import com.example.iamusers.util.DockerUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/deployments")
public class DeploymentController {

    private final EC2Repository repository;
    private final ProjectDetector projectDetector;

    @Value("${app.deployment.upload-dir}")
    private String uploadDir;

    public DeploymentController(
            EC2Repository repository,
            ProjectDetector projectDetector) {

        this.repository = repository;
        this.projectDetector = projectDetector;
    }

    public record GithubDeploymentRequest(
            String name,
            String repositoryUrl) {
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProject(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        if (file == null || file.isEmpty()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Please upload a ZIP file.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null
                || !filename.toLowerCase().endsWith(".zip")) {

            return error(
                    HttpStatus.BAD_REQUEST,
                    "Only ZIP source archives are supported.");
        }

        if (!validName(name)) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Application name is required and must be valid.");
        }

        Path workspace = null;

        try {

            workspace = createWorkspace();

            extractZip(file.getInputStream(), workspace);

            Path projectRoot = locateProjectRoot(workspace);

            return deployProject(
                    projectRoot,
                    name.trim(),
                    authentication.getName(),
                    workspace);

        } catch (Exception exception) {

            if (workspace != null) {
                deleteDirectory(workspace);
            }

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "ZIP deployment failed: "
                            + exception.getMessage());
        }
    }

    @PostMapping("/github")
    public ResponseEntity<?> deployGithub(
            @RequestBody GithubDeploymentRequest request,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        if (request == null || !validName(request.name())) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Application name is required.");
        }

        if (!isPublicGithubUrl(request.repositoryUrl())) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Provide a valid HTTPS GitHub repository URL.");
        }

        Path workspace = null;

        try {

            workspace = createWorkspace();

            Path repositoryDirectory = workspace.resolve("source");

            Path gitLog = workspace.resolve("git.log");

            ProcessBuilder builder = new ProcessBuilder(
                    "git",
                    "clone",
                    "--depth",
                    "1",
                    "--",
                    request.repositoryUrl(),
                    repositoryDirectory.toString());

            builder.redirectErrorStream(true);
            builder.redirectOutput(gitLog.toFile());

            Process process = builder.start();

            boolean completed = process.waitFor(
                    120,
                    TimeUnit.SECONDS);

            if (!completed) {
                process.destroyForcibly();

                throw new RuntimeException(
                        "GitHub clone timed out.");
            }

            if (process.exitValue() != 0) {

                String log = Files.exists(gitLog)
                        ? Files.readString(gitLog)
                        : "No Git output.";

                throw new RuntimeException(
                        "Unable to clone repository: " + log);
            }

            return deployProject(
                    repositoryDirectory,
                    request.name().trim(),
                    authentication.getName(),
                    workspace);

        } catch (Exception exception) {

            if (workspace != null) {
                deleteDirectory(workspace);
            }

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "GitHub deployment failed: "
                            + exception.getMessage());
        }
    }

    private ResponseEntity<?> deployProject(
            Path projectDirectory,
            String applicationName,
            String userId,
            Path workspace) {

        String suffix = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);

        String containerName = "unicloud-" + suffix;
        String imageName = "unicloud-app-" + suffix;

        String containerId = null;

        try {

            // 1. Detect the project and prepare its Dockerfile.
            ProjectDetector.ProjectType projectType = projectDetector.prepare(projectDirectory);

            // 2. Select the port used inside the container.
            int containerPort = switch (projectType) {

                case STATIC_WEBSITE -> 80;

                case CUSTOM_DOCKERFILE ->
                    throw new IllegalArgumentException(
                            "Custom Dockerfiles require explicit container-port configuration.");

                case SPRING_BOOT_MAVEN,
                        SPRING_BOOT_GRADLE,
                        NODE_JS,
                        REACT,
                        PYTHON ->
                    8080;
            };

            // 3. Build the Docker image.
            DockerUtil.buildImage(
                    projectDirectory.toString(),
                    imageName);

            // 4. Configure runtime environment variables.
            Map<String, String> environment = new HashMap<>();

            environment.put("PORT", String.valueOf(containerPort));

            if (projectType == ProjectDetector.ProjectType.SPRING_BOOT_MAVEN
                    || projectType == ProjectDetector.ProjectType.SPRING_BOOT_GRADLE) {

                environment.put(
                        "SERVER_PORT",
                        String.valueOf(containerPort));
            }

            // 5. Start the container using the correct internal port.
            containerId = DockerUtil.runContainer(
                    imageName,
                    containerName,
                    containerPort,
                    environment);

            // Give the process time to start.
            boolean running = false;

            for (int attempt = 0; attempt < 30; attempt++) {

                Thread.sleep(1000);

                if (DockerUtil.isContainerRunning(containerId)) {
                    running = true;
                    break;
                }
            }

            if (!running) {

                String logs = DockerUtil.getContainerLogs(containerId);

                DockerUtil.delete(containerId);
                containerId = null;

                throw new RuntimeException(
                        "Application exited during startup. Logs: "
                                + logs);
            }

            int port = DockerUtil.getPublishedPort(containerId, containerPort);

            EC2Instance instance = new EC2Instance();

            instance.setName(applicationName);
            instance.setContainerId(containerId);
            instance.setContainerName(containerName);
            instance.setPort(port);
            instance.setUserId(userId);
            instance.setImage(imageName);
            instance.setInstanceType(projectType.name());
            instance.setStatus("RUNNING");

            EC2Instance saved = repository.save(instance);

            Map<String, Object> response = new HashMap<>();

            response.put("message", "Deployment created.");
            response.put("instanceId", saved.getId());
            response.put("containerId", containerId);
            response.put("containerName", containerName);
            response.put("imageName", imageName);
            response.put("projectType", projectType.name());
            response.put("port", port);
            response.put("url", "http://localhost:" + port);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception exception) {

            if (containerId != null) {
                try {
                    DockerUtil.delete(containerId);
                } catch (Exception ignored) {
                }
            }

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Deployment failed: "
                            + exception.getMessage());

        } finally {

            // The image has already been built, so the source workspace
            // is no longer needed for this initial deployment.
            deleteDirectory(workspace);
        }
    }

    private Path createWorkspace() throws IOException {

        Path root = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(root);

        return Files.createTempDirectory(
                root,
                "unicloud-build-");
    }

    private void extractZip(
            InputStream inputStream,
            Path destination) throws IOException {

        Path normalizedDestination = destination
                .toAbsolutePath()
                .normalize();

        long totalBytes = 0;
        int fileCount = 0;

        try (ZipInputStream zip = new ZipInputStream(
                new BufferedInputStream(inputStream))) {

            ZipEntry entry;

            while ((entry = zip.getNextEntry()) != null) {

                fileCount++;

                if (fileCount > 20000) {
                    throw new IOException(
                            "ZIP contains too many entries.");
                }

                Path output = normalizedDestination
                        .resolve(entry.getName())
                        .normalize();

                if (!output.startsWith(normalizedDestination)) {
                    throw new IOException(
                            "ZIP contains an invalid file path.");
                }

                if (entry.isDirectory()) {

                    Files.createDirectories(output);

                } else {

                    Files.createDirectories(output.getParent());

                    try (var outputStream = Files.newOutputStream(output)) {

                        byte[] buffer = new byte[8192];
                        int count;

                        while ((count = zip.read(buffer)) != -1) {

                            totalBytes += count;

                            if (totalBytes > 500L * 1024 * 1024) {
                                throw new IOException(
                                        "Expanded ZIP exceeds 500 MB.");
                            }

                            outputStream.write(buffer, 0, count);
                        }
                    }
                }

                zip.closeEntry();
            }
        }
    }

    private Path locateProjectRoot(Path workspace)
            throws IOException {

        // Support ZIPs that contain the project files directly.
        if (containsProjectFiles(workspace)) {
            return workspace;
        }

        // Also support ZIPs that contain a single top-level folder.
        try (var paths = Files.list(workspace)) {

            var directories = paths
                    .filter(Files::isDirectory)
                    .toList();

            if (directories.size() == 1
                    && containsProjectFiles(directories.get(0))) {

                return directories.get(0);
            }
        }

        throw new IOException(
                "Could not locate project files. "
                        + "Put package.json, pom.xml, build.gradle, "
                        + "requirements.txt, or Dockerfile at the "
                        + "project root.");
    }

    private boolean containsProjectFiles(Path directory) {

        return Files.exists(directory.resolve("Dockerfile"))
                || Files.exists(directory.resolve("package.json"))
                || Files.exists(directory.resolve("pom.xml"))
                || Files.exists(directory.resolve("build.gradle"))
                || Files.exists(directory.resolve("build.gradle.kts"))
                || Files.exists(directory.resolve("requirements.txt"))
                || Files.isRegularFile(directory.resolve("index.html"));
    }

    private boolean isPublicGithubUrl(String value) {

        if (value == null || value.isBlank()) {
            return false;
        }

        try {

            URI uri = URI.create(value.trim());

            if (!"https".equalsIgnoreCase(uri.getScheme())) {
                return false;
            }

            if (!"github.com".equalsIgnoreCase(uri.getHost())) {
                return false;
            }

            if (uri.getUserInfo() != null
                    || uri.getPort() != -1
                    || uri.getQuery() != null
                    || uri.getFragment() != null) {
                return false;
            }

            String path = uri.getPath();

            return path != null
                    && path.matches(
                            "/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/?");

        } catch (Exception exception) {
            return false;
        }
    }

    private boolean validName(String name) {

        return name != null
                && !name.isBlank()
                && name.trim().length() <= 100;
    }

    private boolean isAuthenticated(
            Authentication authentication) {

        return authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(
                        String.valueOf(
                                authentication.getPrincipal()));
    }

    private ResponseEntity<Map<String, String>> error(
            HttpStatus status,
            String message) {

        return ResponseEntity.status(status)
                .body(Map.of("error", message));
    }

    private void deleteDirectory(Path directory) {

        if (directory == null || !Files.exists(directory)) {
            return;
        }

        try (var paths = Files.walk(directory)) {

            paths.sorted((first, second) -> second.compareTo(first))
                    .forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });

        } catch (IOException ignored) {
        }
    }
}*/

package com.example.iamusers.controller;

import com.example.iamusers.model.Deployment;
import com.example.iamusers.model.EC2Instance;
import com.example.iamusers.repository.DeploymentRepository;
import com.example.iamusers.repository.EC2Repository;
import com.example.iamusers.service.ProjectDetector;
import com.example.iamusers.util.DockerUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@RestController
@RequestMapping("/deployments")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class DeploymentController {

    private final DeploymentRepository deploymentRepository;
    private final EC2Repository ec2Repository;
    private final ProjectDetector projectDetector;

    @Value("${app.deployment.upload-dir}")
    private String uploadDir;

    public DeploymentController(
            DeploymentRepository deploymentRepository,
            EC2Repository ec2Repository,
            ProjectDetector projectDetector) {

        this.deploymentRepository = deploymentRepository;
        this.ec2Repository = ec2Repository;
        this.projectDetector = projectDetector;
    }

    public record GithubDeploymentRequest(
            String name,
            String repositoryUrl,
            String targetType,
            Long instanceId) {
    }

    // =========================================================
    // LIST THE CURRENT USER'S DEPLOYMENTS
    // GET /deployments/my
    // =========================================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyDeployments(
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        String userId = authentication.getName();

        List<Deployment> deployments = deploymentRepository
                .findByUserIdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> result = new ArrayList<>();

        for (Deployment deployment : deployments) {

            /*
             * Refresh the container status from Docker.
             * A missing container is not reported as RUNNING.
             */
            if (deployment.getContainerId() != null) {
                try {
                    String dockerStatus = DockerUtil.status(
                            deployment.getContainerId());

                    deployment.setStatus(
                            "running".equalsIgnoreCase(dockerStatus)
                                    ? "RUNNING"
                                    : "stopped".equalsIgnoreCase(dockerStatus)
                                            ? "STOPPED"
                                            : "FAILED");

                    deploymentRepository.save(deployment);

                } catch (Exception exception) {
                    deployment.setStatus("FAILED");
                    deploymentRepository.save(deployment);
                }
            }

            Map<String, Object> item = toResponse(deployment);

            if (deployment.getInstanceId() != null) {

                ec2Repository.findByIdAndUserId(
                        deployment.getInstanceId(),
                        userId).ifPresent(instance -> {
                            item.put("instanceName", instance.getName());
                        });
            }

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    // =========================================================
    // LIST ALL DEPLOYMENTS FOR ADMIN
    // GET /deployments/admin/all
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllDeployments() {

        List<Deployment> deployments = deploymentRepository.findAll(
                org.springframework.data.domain.Sort
                        .by(org.springframework.data.domain.Sort.Direction.DESC,
                                "createdAt"));

        List<Map<String, Object>> result = new ArrayList<>();

        for (Deployment deployment : deployments) {

            // Refresh status from Docker before returning the deployment.
            if (deployment.getContainerId() != null) {
                try {
                    String dockerStatus = DockerUtil.status(deployment.getContainerId());

                    deployment.setStatus(
                            "running".equalsIgnoreCase(dockerStatus)
                                    ? "RUNNING"
                                    : "stopped".equalsIgnoreCase(dockerStatus)
                                            ? "STOPPED"
                                            : "FAILED");

                    deploymentRepository.save(deployment);

                } catch (Exception exception) {
                    deployment.setStatus("FAILED");
                    deploymentRepository.save(deployment);
                }
            }

            Map<String, Object> item = toResponse(deployment);

            // Include the associated instance name for the admin table.
            if (deployment.getInstanceId() != null) {
                ec2Repository.findById(deployment.getInstanceId())
                        .ifPresent(instance -> item.put("instanceName", instance.getName()));
            }

            result.add(item);
        }

        return ResponseEntity.ok(result);
    }

    // =========================================================
    // UPLOAD ZIP PROJECT
    // POST /deployments/upload
    // =========================================================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadProject(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("targetType") String targetType,
            @RequestParam(value = "instanceId", required = false) Long instanceId,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        if (file == null || file.isEmpty()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Choose a ZIP file.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null
                || !filename.toLowerCase().endsWith(".zip")) {

            return error(
                    HttpStatus.BAD_REQUEST,
                    "Only ZIP files are supported.");
        }

        if (!validName(name)) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Application name must contain 1 to 100 characters.");
        }

        ResponseEntity<?> targetError = validateTarget(
                targetType,
                instanceId,
                authentication.getName());

        if (targetError != null) {
            return targetError;
        }

        Path workspace = null;

        try {

            workspace = createWorkspace();

            extractZip(
                    file.getInputStream(),
                    workspace);

            Path projectDirectory = locateProjectRoot(workspace);

            return deployProject(
                    projectDirectory,
                    name.trim(),
                    "ZIP",
                    filename,
                    targetType,
                    instanceId,
                    authentication.getName(),
                    workspace);

        } catch (Exception exception) {

            deleteDirectory(workspace);

            return error(
                    HttpStatus.BAD_REQUEST,
                    "ZIP deployment failed: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // UPLOAD JAVA JAR APPLICATION
    // POST /deployments/jar
    // =========================================================

    @PostMapping(value = "/jar", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadJar(
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("targetType") String targetType,
            @RequestParam(value = "instanceId", required = false) Long instanceId,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        if (file == null || file.isEmpty()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Choose a JAR file.");
        }

        String filename = file.getOriginalFilename();

        if (filename == null
                || !filename.toLowerCase(java.util.Locale.ROOT).endsWith(".jar")) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Only JAR files are supported.");
        }

        if (!validName(name)) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Application name must contain 1 to 100 characters.");
        }

        ResponseEntity<?> targetError = validateTarget(
                targetType,
                instanceId,
                authentication.getName());

        if (targetError != null) {
            return targetError;
        }

        Path workspace = null;

        try {
            workspace = createWorkspace();

            Path jarPath = workspace.resolve("application.jar");

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(
                        inputStream,
                        jarPath,
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }

            if (Files.size(jarPath) == 0) {
                throw new IOException("The uploaded JAR file is empty.");
            }

            /*
             * Create a Dockerfile for the uploaded executable JAR.
             * This example uses Java 17. Change the runtime version
             * if your application requires a different Java version.
             */
            String dockerfile = """
                    FROM eclipse-temurin:17-jre
                    WORKDIR /app
                    COPY application.jar app.jar
                    EXPOSE 8080
                    ENTRYPOINT ["java", "-jar", "app.jar"]
                    """;

            Files.writeString(
                    workspace.resolve("Dockerfile"),
                    dockerfile);

            return deployProject(
                    workspace,
                    name.trim(),
                    "JAR",
                    filename,
                    targetType,
                    instanceId,
                    authentication.getName(),
                    workspace);

        } catch (Exception exception) {
            deleteDirectory(workspace);

            return error(
                    HttpStatus.BAD_REQUEST,
                    "JAR deployment failed: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // DEPLOY PUBLIC GITHUB REPOSITORY
    // POST /deployments/github
    // =========================================================

    @PostMapping("/github")
    public ResponseEntity<?> deployGithub(
            @RequestBody GithubDeploymentRequest request,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        if (request == null || !validName(request.name())) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Application name is required.");
        }

        if (!isPublicGithubUrl(request.repositoryUrl())) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Provide a valid HTTPS GitHub repository URL.");
        }

        ResponseEntity<?> targetError = validateTarget(
                request.targetType(),
                request.instanceId(),
                authentication.getName());

        if (targetError != null) {
            return targetError;
        }

        Path workspace = null;

        try {

            workspace = createWorkspace();

            Path sourceDirectory = workspace.resolve("source");

            Path gitLog = workspace.resolve("git.log");

            ProcessBuilder builder = new ProcessBuilder(
                    "git",
                    "clone",
                    "--depth",
                    "1",
                    "--",
                    request.repositoryUrl(),
                    sourceDirectory.toString());

            builder.redirectErrorStream(true);
            builder.redirectOutput(gitLog.toFile());

            Process process = builder.start();

            boolean completed = process.waitFor(
                    120,
                    TimeUnit.SECONDS);

            if (!completed) {
                process.destroyForcibly();

                throw new IOException(
                        "GitHub clone timed out.");
            }

            if (process.exitValue() != 0) {

                String log = Files.exists(gitLog)
                        ? Files.readString(gitLog)
                        : "No Git output.";

                throw new IOException(
                        "Unable to clone repository: " + log);
            }

            return deployProject(
                    sourceDirectory,
                    request.name().trim(),
                    "GITHUB",
                    request.repositoryUrl(),
                    request.targetType(),
                    request.instanceId(),
                    authentication.getName(),
                    workspace);

        } catch (Exception exception) {

            deleteDirectory(workspace);

            return error(
                    HttpStatus.BAD_REQUEST,
                    "GitHub deployment failed: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // BUILD AND START DEPLOYMENT
    // =========================================================

    private ResponseEntity<?> deployProject(
            Path projectDirectory,
            String applicationName,
            String sourceType,
            String sourceLocation,
            String targetType,
            Long instanceId,
            String userId,
            Path workspace) {

        String suffix = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12);

        String imageName = "unicloud-app-" + suffix;
        String containerName = "unicloud-app-" + suffix;

        String containerId = null;

        try {

            ProjectDetector.ProjectType projectType = projectDetector.prepare(projectDirectory);

            int containerPort;

            switch (projectType) {

                case STATIC_WEBSITE:
                    containerPort = 80;
                    break;

                case CUSTOM_DOCKERFILE:
                    return error(
                            HttpStatus.BAD_REQUEST,
                            "Custom Dockerfiles require explicit port configuration. "
                                    + "This controller does not yet accept a custom container port.");

                case SPRING_BOOT_MAVEN:
                case SPRING_BOOT_GRADLE:
                case SPRING_BOOT_JAR:
                case NODE_JS:
                case REACT:
                case PYTHON:
                    containerPort = 8080;
                    break;

                default:
                    return error(
                            HttpStatus.BAD_REQUEST,
                            "Unsupported project type.");
            }

            /*
             * Build the image using the Docker utility supplied
             * in this project.
             */
            DockerUtil.buildImage(
                    projectDirectory.toString(),
                    imageName);

            Map<String, String> environment = new HashMap<>();

            environment.put(
                    "PORT",
                    String.valueOf(containerPort));

            if (projectType == ProjectDetector.ProjectType.SPRING_BOOT_MAVEN
                    || projectType == ProjectDetector.ProjectType.SPRING_BOOT_GRADLE) {

                environment.put(
                        "SERVER_PORT",
                        String.valueOf(containerPort));
            }

            /*
             * Each application runs in its own Docker container.
             * Docker assigns an available host port automatically.
             */
            containerId = DockerUtil.runContainer(
                    imageName,
                    containerName,
                    containerPort,
                    environment);

            /*
             * Check whether the container remains running.
             * This is not an HTTP readiness check.
             */
            boolean running = false;

            for (int attempt = 0; attempt < 15; attempt++) {

                if (DockerUtil.isContainerRunning(containerId)) {
                    running = true;
                    break;
                }

                Thread.sleep(1000);
            }

            if (!running) {

                String logs = DockerUtil.getContainerLogs(containerId);

                DockerUtil.delete(containerId);
                containerId = null;

                throw new RuntimeException(
                        "Application container did not remain running. "
                                + logs);
            }

            int hostPort = DockerUtil.getPublishedPort(
                    containerId,
                    containerPort);

            Deployment deployment = new Deployment();

            deployment.setName(applicationName);
            deployment.setUserId(userId);
            deployment.setSourceType(sourceType);
            deployment.setSourceLocation(sourceLocation);
            deployment.setProjectType(projectType.name());
            deployment.setStatus("RUNNING");
            deployment.setImageName(imageName);
            deployment.setContainerId(containerId);
            deployment.setContainerName(containerName);
            deployment.setContainerPort(containerPort);
            deployment.setHostPort(hostPort);

            /*
             * Existing target: record the selected instance.
             * New target: leave instanceId null.
             *
             * Both cases currently create a separate application
             * container. This is an association, not execution
             * inside the instance's own container.
             */
            if ("EXISTING".equalsIgnoreCase(targetType)) {
                deployment.setInstanceId(instanceId);
            }

            deployment.setApplicationUrl(
                    "http://localhost:" + hostPort);

            Deployment saved = deploymentRepository.save(deployment);

            Map<String, Object> response = toResponse(saved);

            response.put(
                    "message",
                    "Deployment created successfully.");

            response.put(
                    "targetType",
                    targetType.toUpperCase());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception exception) {

            if (containerId != null) {
                try {
                    DockerUtil.delete(containerId);
                } catch (Exception cleanupException) {
                    System.err.println(
                            "Container cleanup failed: "
                                    + cleanupException.getMessage());
                }
            }

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Deployment failed: "
                            + safeMessage(exception));

        } finally {

            deleteDirectory(workspace);
        }
    }

    // =========================================================
    // START DEPLOYMENT
    // POST /deployments/{id}/start
    // =========================================================

    @PostMapping("/{id}/start")
    public ResponseEntity<?> startDeployment(
            @PathVariable Long id,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        Deployment deployment = findOwnedDeployment(
                id,
                authentication.getName());

        if (deployment == null) {
            return error(
                    HttpStatus.NOT_FOUND,
                    "Deployment not found.");
        }

        try {

            DockerUtil.start(
                    deployment.getContainerId());

            deployment.setStatus("RUNNING");
            deployment.setErrorMessage(null);

            Deployment saved = deploymentRepository.save(deployment);

            return ResponseEntity.ok(toResponse(saved));

        } catch (Exception exception) {

            deployment.setStatus("FAILED");
            deployment.setErrorMessage(
                    safeMessage(exception));

            deploymentRepository.save(deployment);

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not start deployment: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // STOP DEPLOYMENT
    // POST /deployments/{id}/stop
    // =========================================================

    @PostMapping("/{id}/stop")
    public ResponseEntity<?> stopDeployment(
            @PathVariable Long id,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        Deployment deployment = findOwnedDeployment(
                id,
                authentication.getName());

        if (deployment == null) {
            return error(
                    HttpStatus.NOT_FOUND,
                    "Deployment not found.");
        }

        try {

            DockerUtil.stop(
                    deployment.getContainerId());

            deployment.setStatus("STOPPED");

            Deployment saved = deploymentRepository.save(deployment);

            return ResponseEntity.ok(toResponse(saved));

        } catch (Exception exception) {

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not stop deployment: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // DELETE DEPLOYMENT
    // DELETE /deployments/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeployment(
            @PathVariable Long id,
            Authentication authentication) {

        if (!isAuthenticated(authentication)) {
            return error(
                    HttpStatus.UNAUTHORIZED,
                    "Authentication required.");
        }

        /*
         * Deployment deployment = findOwnedDeployment(
         * id,
         * authentication.getName());
         * 
         * if (deployment == null) {
         * return error(
         * HttpStatus.NOT_FOUND,
         * "Deployment not found.");
         * }
         */boolean isAdmin = authentication.getAuthorities()
                .stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        Deployment deployment;

        if (isAdmin) {
            // Admin can find deployments belonging to any user.
            deployment = deploymentRepository.findById(id).orElse(null);
        } else {
            // Regular users can only find their own deployments.
            deployment = findOwnedDeployment(id, authentication.getName());
        }

        if (deployment == null) {
            return error(
                    HttpStatus.NOT_FOUND,
                    "Deployment not found.");
        }

        try {

            if (deployment.getContainerId() != null) {
                try {
                    DockerUtil.delete(
                            deployment.getContainerId());
                } catch (Exception exception) {

                    /*
                     * If Docker no longer has this container,
                     * allow the stale database record to be removed.
                     */
                    System.err.println(
                            "Container cleanup warning: "
                                    + exception.getMessage());
                }
            }

            deploymentRepository.delete(deployment);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Deployment deleted successfully."));

        } catch (Exception exception) {

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not delete deployment: "
                            + safeMessage(exception));
        }
    }

    // =========================================================
    // VALIDATE TARGET AND OWNERSHIP
    // =========================================================

    private ResponseEntity<?> validateTarget(
            String targetType,
            Long instanceId,
            String userId) {

        if (targetType == null) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Select a deployment target.");
        }

        if ("NEW".equalsIgnoreCase(targetType)) {

            if (instanceId != null) {
                return error(
                        HttpStatus.BAD_REQUEST,
                        "Do not provide instanceId for a new target.");
            }

            return null;
        }

        if ("EXISTING".equalsIgnoreCase(targetType)) {

            if (instanceId == null) {
                return error(
                        HttpStatus.BAD_REQUEST,
                        "Select an existing instance.");
            }

            EC2Instance instance = ec2Repository.findByIdAndUserId(
                    instanceId,
                    userId).orElse(null);

            if (instance == null) {
                return error(
                        HttpStatus.NOT_FOUND,
                        "The selected instance was not found.");
            }

            if (!"RUNNING".equalsIgnoreCase(
                    instance.getStatus())) {

                return error(
                        HttpStatus.BAD_REQUEST,
                        "The selected instance must be running.");
            }

            return null;
        }

        return error(
                HttpStatus.BAD_REQUEST,
                "targetType must be NEW or EXISTING.");
    }

    private Deployment findOwnedDeployment(
            Long id,
            String userId) {

        return deploymentRepository
                .findByIdAndUserId(id, userId)
                .orElse(null);
    }

    // =========================================================
    // RESPONSE DTO
    // =========================================================

    private Map<String, Object> toResponse(
            Deployment deployment) {

        Map<String, Object> response = new HashMap<>();

        response.put("id", deployment.getId());
        response.put("name", deployment.getName());
        response.put("userId", deployment.getUserId());
        response.put("sourceType", deployment.getSourceType());
        response.put("sourceLocation", deployment.getSourceLocation());
        response.put("projectType", deployment.getProjectType());
        response.put("runtime", deployment.getProjectType());
        response.put("status", deployment.getStatus());
        response.put("imageName", deployment.getImageName());
        response.put("containerName", deployment.getContainerName());
        response.put("containerPort", deployment.getContainerPort());
        response.put("port", deployment.getHostPort());
        response.put("instanceId", deployment.getInstanceId());
        response.put("url", deployment.getApplicationUrl());
        response.put("applicationUrl", deployment.getApplicationUrl());
        response.put("errorMessage", deployment.getErrorMessage());
        response.put("createdAt", deployment.getCreatedAt());
        response.put("updatedAt", deployment.getUpdatedAt());

        return response;
    }

    // =========================================================
    // ZIP EXTRACTION
    // =========================================================

    private Path createWorkspace() throws IOException {

        Path root = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();

        Files.createDirectories(root);

        return Files.createTempDirectory(
                root,
                "unicloud-build-");
    }

    private void extractZip(
            InputStream inputStream,
            Path destination) throws IOException {

        Path normalizedDestination = destination.toAbsolutePath().normalize();

        long totalBytes = 0;
        int fileCount = 0;

        try (ZipInputStream zip = new ZipInputStream(
                new BufferedInputStream(inputStream))) {

            ZipEntry entry;

            while ((entry = zip.getNextEntry()) != null) {

                fileCount++;

                if (fileCount > 20000) {
                    throw new IOException(
                            "ZIP contains too many entries.");
                }

                Path output = normalizedDestination
                        .resolve(entry.getName())
                        .normalize();

                if (!output.startsWith(normalizedDestination)) {
                    throw new IOException(
                            "ZIP contains an invalid file path.");
                }

                if (entry.isDirectory()) {

                    Files.createDirectories(output);

                } else {

                    Files.createDirectories(output.getParent());

                    try (var outputStream = Files.newOutputStream(output)) {

                        byte[] buffer = new byte[8192];
                        int count;

                        while ((count = zip.read(buffer)) != -1) {

                            totalBytes += count;

                            if (totalBytes > 500L * 1024 * 1024) {
                                throw new IOException(
                                        "Expanded ZIP exceeds 500 MB.");
                            }

                            outputStream.write(
                                    buffer,
                                    0,
                                    count);
                        }
                    }
                }

                zip.closeEntry();
            }
        }
    }

    private Path locateProjectRoot(
            Path workspace) throws IOException {

        if (containsProjectFiles(workspace)) {
            return workspace;
        }

        try (var paths = Files.list(workspace)) {

            List<Path> directories = paths
                    .filter(Files::isDirectory)
                    .toList();

            if (directories.size() == 1
                    && containsProjectFiles(directories.get(0))) {

                return directories.get(0);
            }
        }

        throw new IOException(
                "Could not locate project files at the project root.");
    }

    private boolean containsProjectFiles(Path directory) {

        return Files.exists(directory.resolve("Dockerfile"))
                || Files.exists(directory.resolve("package.json"))
                || Files.exists(directory.resolve("pom.xml"))
                || Files.exists(directory.resolve("build.gradle"))
                || Files.exists(directory.resolve("build.gradle.kts"))
                || Files.exists(directory.resolve("requirements.txt"))
                || Files.isRegularFile(
                        directory.resolve("index.html"));
    }

    // =========================================================
    // VALIDATION AND HELPERS
    // =========================================================

    private boolean isPublicGithubUrl(String value) {

        if (value == null || value.isBlank()) {
            return false;
        }

        try {

            URI uri = URI.create(value.trim());

            if (!"https".equalsIgnoreCase(uri.getScheme())) {
                return false;
            }

            if (!"github.com".equalsIgnoreCase(uri.getHost())) {
                return false;
            }

            if (uri.getUserInfo() != null
                    || uri.getPort() != -1
                    || uri.getQuery() != null
                    || uri.getFragment() != null) {
                return false;
            }

            String path = uri.getPath();

            return path != null
                    && path.matches(
                            "/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+/?");

        } catch (Exception exception) {
            return false;
        }
    }

    private boolean validName(String name) {

        return name != null
                && !name.isBlank()
                && name.trim().length() <= 100;
    }

    private boolean isAuthenticated(
            Authentication authentication) {

        return authentication != null
                && authentication.isAuthenticated()
                && !"anonymousUser".equals(
                        String.valueOf(
                                authentication.getPrincipal()));
    }

    private ResponseEntity<Map<String, String>> error(
            HttpStatus status,
            String message) {

        Map<String, String> body = new HashMap<>();

        body.put("error", message);

        return ResponseEntity
                .status(status)
                .body(body);
    }

    private String safeMessage(Exception exception) {

        String message = exception.getMessage();

        if (message == null || message.isBlank()) {
            return "An unexpected error occurred.";
        }

        return message.length() > 1800
                ? message.substring(0, 1800)
                : message;
    }

    private void deleteDirectory(Path directory) {

        if (directory == null || !Files.exists(directory)) {
            return;
        }

        try (var paths = Files.walk(directory)) {

            paths.sorted(
                    (first, second) -> second.compareTo(first)).forEach(path -> {
                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException exception) {
                            System.err.println(
                                    "Could not delete temporary file: "
                                            + path);
                        }
                    });

        } catch (IOException exception) {
            System.err.println(
                    "Could not clean workspace: "
                            + exception.getMessage());
        }
    }

}
