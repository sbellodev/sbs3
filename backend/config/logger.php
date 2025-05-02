<?php
// Enable error reporting (for terminal/output)
error_reporting(E_ALL);
ini_set('display_errors', 1); // Show errors in response (dev only!)

// Log errors to file
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../debug.log');

function logError($message)
{
    error_log("[ERROR] " . $message); // Writes to debug.log
}
?>