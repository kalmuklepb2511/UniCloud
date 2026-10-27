package com.example.iamusers.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
public class DatabaseProvisioningService {

    private final String jdbcUrl;
    private final String adminUsername;
    private final String adminPassword;

    private final SecureRandom secureRandom = new SecureRandom();

    public DatabaseProvisioningService(
            @Value("${unicloud.database.admin-url}") String jdbcUrl,
            @Value("${unicloud.database.admin-username}") String adminUsername,
            @Value("${unicloud.database.admin-password}") String adminPassword) {

        this.jdbcUrl = jdbcUrl;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    public ProvisionedDatabase createDatabase() throws SQLException {

        String suffix = UUID.randomUUID()
                .toString()
                .replace("-", "")
                .substring(0, 12)
                .toLowerCase(Locale.ROOT);

        String databaseName = "uc_db_" + suffix;
        String databaseUsername = "uc_user_" + suffix;
        String databasePassword = generatePassword();

        String quotedDatabase = quoteIdentifier(databaseName);
        String quotedUsername = quoteIdentifier(databaseUsername);

        try (Connection connection = DriverManager.getConnection(
                jdbcUrl, adminUsername, adminPassword);
                Statement statement = connection.createStatement()) {

            statement.executeUpdate(
                    "CREATE DATABASE " + quotedDatabase
                            + " CHARACTER SET utf8mb4"
                            + " COLLATE utf8mb4_unicode_ci");

            statement.executeUpdate(
                    "CREATE USER " + quotedUsername
                            + "@'%' IDENTIFIED BY "
                            + quoteSqlString(databasePassword));

            statement.executeUpdate(
                    "GRANT ALL PRIVILEGES ON "
                            + quotedDatabase
                            + ".* TO "
                            + quotedUsername
                            + "@'%'");

            return new ProvisionedDatabase(
                    databaseName,
                    databaseUsername,
                    databasePassword);
        } catch (SQLException exception) {
            // A production implementation should also clean up any
            // partially created database/user before reporting failure.
            throw exception;
        }
    }

    public void deleteDatabase(ProvisionedDatabase database)
            throws SQLException {

        String quotedDatabase = quoteIdentifier(database.databaseName());
        String quotedUsername = quoteIdentifier(database.username());

        try (Connection connection = DriverManager.getConnection(
                jdbcUrl, adminUsername, adminPassword);
                Statement statement = connection.createStatement()) {

            statement.executeUpdate(
                    "DROP DATABASE IF EXISTS " + quotedDatabase);

            statement.executeUpdate(
                    "DROP USER IF EXISTS " + quotedUsername + "@'%'");
        }
    }

    private String generatePassword() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private String quoteIdentifier(String identifier) {
        if (!identifier.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalArgumentException("Invalid SQL identifier");
        }

        return "`" + identifier + "`";
    }

    private String quoteSqlString(String value) {
        return "'" + value.replace("\\", "\\\\")
                .replace("'", "''") + "'";
    }

    public record ProvisionedDatabase(
            String databaseName,
            String username,
            String password) {
    }
}
