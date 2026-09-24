package com.unicloud.unicloud_backend.util;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.concurrent.atomic.AtomicInteger;

public class DockerUtil {

    private static AtomicInteger port = new AtomicInteger(9000);
 
    

    public static String runContainer(String jarPath, int port, String name) {

                // FIX WINDOWS PATH ISSUE
        String fixedPath = jarPath.replace("\\", "/");

        try {
            ProcessBuilder pb = new ProcessBuilder(
                "docker", "run", "-d",
                "--name", name,
                "-p", port + ":8080",
                "--memory=512m",
                "--cpus=1",
                "-v", jarPath + ":/app/app.jar",
                "openjdk:17",
                "java", "-jar", "/app/app.jar"
            );

            pb.redirectErrorStream(true);

            Process process = pb.start();

            BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
            );

            String containerId = reader.readLine();

            return containerId;

        } catch (Exception e) {
            throw new RuntimeException("Docker run failed: " + e.getMessage());
        }
    }

    public static String getStatusByName(String containerName) {

    try {

        ProcessBuilder pb = new ProcessBuilder(
            "docker", "ps", "-a",
            "--filter", "name=" + containerName,
            "--format", "{{.Status}}"
        );

        Process process = pb.start();

        BufferedReader reader = new BufferedReader(
            new InputStreamReader(process.getInputStream())
        );

        return reader.readLine();

    } catch (Exception e) {
        return "Error: " + e.getMessage();
    }
}

    public static void stop(String containerId) throws Exception {
        Runtime.getRuntime().exec("docker stop " + containerId);
    }

    public static void delete(String containerId) throws Exception {
        Runtime.getRuntime().exec("docker rm -f " + containerId);
    }

    public static String status(String containerId) throws Exception {
        Process p = Runtime.getRuntime().exec(
            "docker ps -a --filter id=" + containerId + " --format {{.Status}}"
        );

        BufferedReader reader =
            new BufferedReader(new InputStreamReader(p.getInputStream()));

        return reader.readLine();
    }

    public static String logs(String containerId) throws Exception {
        Process p = Runtime.getRuntime().exec("docker logs " + containerId);

        BufferedReader reader =
            new BufferedReader(new InputStreamReader(p.getInputStream()));

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString();
    }
}