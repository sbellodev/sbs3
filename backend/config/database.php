<?php

// Detect environment based on URL
$isLocal = isset($_SERVER['HTTP_HOST']) &&
    (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false ||
        strpos($_SERVER['HTTP_HOST'], '127.0.0.1') !== false);

// Set database configuration based on environment
if ($isLocal) {
    // Local development configuration
    $dbHost = 'db';  // Docker service name or localhost
    $dbUser = 'root';
    $dbPass = 'rootpassword';
    $dbName = 'sbs3';
} else {
    // Production configuration
    $dbHost = 'localhost';
    $dbUser = 'root';  // Use different credentials in production!
    $dbPass = '';
    $dbName = 'sbs3';
}


define('DB_HOST', $dbHost);
define('DB_USER', $dbUser);
define('DB_PASS', $dbPass);
define('DB_NAME', $dbName);

// Database connection with enhanced error handling
$conn = null;

try {
    // Create connection
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    // Verify connection
    if ($conn->connect_error) {
        throw new Exception("MySQL Connection Failed: " . $conn->connect_error);
    }

    // Set charset to UTF-8
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error loading character set utf8mb4: " . $conn->error);
    }

    // Optional: Ping server to verify connection is alive
    if (!$conn->ping()) {
        throw new Exception("MySQL Server is unreachable");
    }

    // Connection successful (for debugging)
    // error_log("Successfully connected to database: " . DB_NAME);

} catch (Exception $e) {
    // Log detailed error (check Render.com logs or server error log)
    error_log("DATABASE ERROR: " . $e->getMessage());

    // Generic user message (don't expose details in production)
    die("A database error occurred. Please try again later.");

    // For debugging, you could show details temporarily:
    // die("Database Error: " . $e->getMessage());
}

// Close connection (call this when done, e.g., $conn->close())
register_shutdown_function(function () use ($conn) {
    if ($conn instanceof mysqli && !$conn->connect_error) {
        $conn->close();
    }
});
?>