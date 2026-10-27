package com.example.iamusers.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class ProjectDetector {

    public enum ProjectType {
        CUSTOM_DOCKERFILE,
        SPRING_BOOT_MAVEN,
        SPRING_BOOT_GRADLE,
        SPRING_BOOT_JAR,
        NODE_JS,
        REACT,
        STATIC_WEBSITE,
        PYTHON
    }

    public ProjectType detect(Path projectDirectory)
            throws IOException {

        // Detect an uploaded executable JAR before checking Dockerfile.
        if (Files.isRegularFile(projectDirectory.resolve("application.jar"))) {
            return ProjectType.SPRING_BOOT_JAR;
        }
        // A custom Dockerfile takes precedence.
        if (Files.isRegularFile(projectDirectory.resolve("Dockerfile"))) {
            return ProjectType.CUSTOM_DOCKERFILE;
        }

        Path packageJson = projectDirectory.resolve("package.json");

        if (Files.isRegularFile(packageJson)) {
            String packageContents = Files.readString(
                    packageJson,
                    StandardCharsets.UTF_8);

            if (packageContents.matches(
                    "(?s).*\"react\"\\s*:.*")) {
                return ProjectType.REACT;
            }

            return ProjectType.NODE_JS;
        }

        if (Files.isRegularFile(
                projectDirectory.resolve("pom.xml"))) {

            return ProjectType.SPRING_BOOT_MAVEN;
        }

        if (Files.isRegularFile(
                projectDirectory.resolve("build.gradle"))
                || Files.isRegularFile(
                        projectDirectory.resolve("build.gradle.kts"))) {

            return ProjectType.SPRING_BOOT_GRADLE;
        }

        // Detect a static HTML, CSS, and JavaScript website.
        if (Files.isRegularFile(
                projectDirectory.resolve("index.html"))) {

            return ProjectType.STATIC_WEBSITE;
        }

        if (Files.isRegularFile(
                projectDirectory.resolve("requirements.txt"))
                && (Files.isRegularFile(
                        projectDirectory.resolve("main.py"))
                        || Files.isRegularFile(
                                projectDirectory.resolve("app.py")))) {

            return ProjectType.PYTHON;
        }

        throw new IllegalArgumentException(
                "Unsupported project. Provide a Dockerfile, "
                        + "pom.xml, build.gradle, package.json, "
                        + "or a supported Python project.");
    }

    public ProjectType prepare(Path projectDirectory)
            throws IOException {

        ProjectType type = detect(projectDirectory);

        // Preserve the user's Dockerfile.
        if (type == ProjectType.CUSTOM_DOCKERFILE) {
            return type;
        }

        String dockerfile = switch (type) {

            case SPRING_BOOT_MAVEN ->
                springBootMavenDockerfile();

            case SPRING_BOOT_GRADLE ->
                springBootGradleDockerfile();

            case SPRING_BOOT_JAR ->
                springBootJarDockerfile();

            case NODE_JS ->
                nodeDockerfile();

            case REACT ->
                reactDockerfile();

            case STATIC_WEBSITE ->
                staticWebsiteDockerfile();

            case PYTHON ->
                pythonDockerfile(projectDirectory);

            case CUSTOM_DOCKERFILE ->
                throw new IllegalStateException(
                        "Custom Dockerfile should already exist.");
        };

        Files.writeString(
                projectDirectory.resolve("Dockerfile"),
                dockerfile,
                StandardCharsets.UTF_8);

        return type;
    }

    private String springBootMavenDockerfile() {

        return """
                FROM maven:3.9-eclipse-temurin-17 AS build

                WORKDIR /source

                COPY . .

                RUN mvn -B -DskipTests clean package

                RUN JAR="$(find target -maxdepth 1 -type f -name '*.jar' ! -name '*-sources.jar' ! -name '*-javadoc.jar' | head -n 1)" \\
                    && test -n "$JAR" \\
                    && cp "$JAR" /application.jar

                FROM eclipse-temurin:17-jre

                WORKDIR /app

                COPY --from=build /application.jar /app/application.jar

                ENV SERVER_PORT=8080

                EXPOSE 8080

                ENTRYPOINT ["java", "-jar", "/app/application.jar", "--server.port=8080"]
                """;
    }

    private String springBootGradleDockerfile() {

        return """
                FROM gradle:8.10-jdk17 AS build

                WORKDIR /source

                COPY . .

                RUN gradle --no-daemon clean bootJar -x test

                RUN JAR="$(find build/libs -maxdepth 1 -type f -name '*.jar' ! -name '*-sources.jar' ! -name '*-javadoc.jar' | head -n 1)" \\
                    && test -n "$JAR" \\
                    && cp "$JAR" /application.jar

                FROM eclipse-temurin:17-jre

                WORKDIR /app

                COPY --from=build /application.jar /app/application.jar

                EXPOSE 8080

                ENTRYPOINT ["java", "-jar", "/app/application.jar", "--server.port=8080"]
                """;
    }

    private String springBootJarDockerfile() {
        return """
                FROM eclipse-temurin:17-jre

                WORKDIR /app

                COPY application.jar /app/application.jar

                ENV SERVER_PORT=8080

                EXPOSE 8080

                ENTRYPOINT ["java", "-jar", "/app/application.jar", "--server.port=8080"]
                """;
    }

    private String nodeDockerfile() {

        return """
                FROM node:22-alpine

                WORKDIR /app

                COPY package*.json ./

                RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

                COPY . .

                ENV NODE_ENV=production
                ENV PORT=8080

                EXPOSE 8080

                CMD ["npm", "start"]
                """;
    }

    private String reactDockerfile() {

        return """
                FROM node:22-alpine AS build

                WORKDIR /source

                COPY package*.json ./

                RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

                COPY . .

                RUN npm run build

                RUN if [ -d dist ]; then cp -r dist /static-output; \\
                    elif [ -d build ]; then cp -r build /static-output; \\
                    else echo "React build output not found"; exit 1; fi

                FROM nginx:alpine

                COPY --from=build /static-output/ /usr/share/nginx/html/

                RUN printf 'server {\\n    listen 8080;\\n    server_name _;\\n    root /usr/share/nginx/html;\\n    index index.html;\\n    location / { try_files $uri $uri/ /index.html; }\\n}\\n' > /etc/nginx/conf.d/default.conf

                EXPOSE 8080
                """;
    }

    private String staticWebsiteDockerfile() {

        return """
                FROM nginx:alpine

                COPY . /usr/share/nginx/html/

                EXPOSE 80
                """;
    }

    private String pythonDockerfile(Path projectDirectory)
            throws IOException {

        String entryPoint;

        if (Files.isRegularFile(projectDirectory.resolve("main.py"))) {
            entryPoint = "main.py";
        } else {
            entryPoint = "app.py";
        }

        return """
                FROM python:3.12-slim

                WORKDIR /app

                COPY requirements.txt .

                RUN pip install --no-cache-dir -r requirements.txt

                COPY . .

                ENV PORT=8080
                ENV PYTHONUNBUFFERED=1

                EXPOSE 8080

                CMD ["python", "%s"]
                """.formatted(entryPoint);
    }
}