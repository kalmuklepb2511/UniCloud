package com.example.iamusers.service;

import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ProjectDetectionService {

    public enum ProjectType {
        SPRING_BOOT,
        NODE_JS,
        REACT,
        PYTHON_FLASK,
        PYTHON_FASTAPI,
        STATIC_HTML,
        DOCKERFILE,
        UNKNOWN
    }

    public ProjectType detect(Path projectDirectory) {

        if (!Files.isDirectory(projectDirectory)) {
            return ProjectType.UNKNOWN;
        }

        // Explicit Dockerfiles are detected but not executed
        // by the initial implementation.
        if (Files.exists(projectDirectory.resolve("Dockerfile"))) {
            return ProjectType.DOCKERFILE;
        }

        if (Files.exists(projectDirectory.resolve("pom.xml"))
                || Files.exists(projectDirectory.resolve("mvnw"))) {
            return ProjectType.SPRING_BOOT;
        }

        Path packageJson = projectDirectory.resolve("package.json");

        if (Files.exists(packageJson)) {
            try {
                String content = Files.readString(packageJson);

                if (content.contains("\"react\"")) {
                    return ProjectType.REACT;
                }

                return ProjectType.NODE_JS;

            } catch (Exception exception) {
                return ProjectType.NODE_JS;
            }
        }

        Path requirements = projectDirectory.resolve("requirements.txt");

        if (Files.exists(requirements)) {
            try {
                String content = Files.readString(requirements)
                        .toLowerCase();

                if (content.contains("fastapi")) {
                    return ProjectType.PYTHON_FASTAPI;
                }

                if (content.contains("flask")) {
                    return ProjectType.PYTHON_FLASK;
                }

            } catch (Exception ignored) {
                // Fall through to other detection options.
            }
        }

        if (Files.exists(projectDirectory.resolve("app.py"))) {
            return ProjectType.PYTHON_FLASK;
        }

        if (Files.exists(projectDirectory.resolve("index.html"))) {
            return ProjectType.STATIC_HTML;
        }

        return ProjectType.UNKNOWN;
    }
}