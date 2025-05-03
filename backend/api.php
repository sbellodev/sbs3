<?php
require_once __DIR__ . '/config/logger.php';
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    require_once __DIR__ . '/config/database.php';

    // Route requests
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = isset($_GET['path']) ? $_GET['path'] : '';

    if (empty($path)) {
        echo json_encode(['message' => 'API root - nothing to see here']);
        exit;
    }

    $parts = explode('/', trim($path, '/'));
    $endpoint = $parts[0] ?? '';

    switch ($endpoint) {
        case 'auth':
            require_once __DIR__ . '/controllers/AuthController.php';
            $controller = new AuthController();
            break;

        case 'tournaments':
            // require_once __DIR__ . '/middleware/AuthMiddleware.php';
            // AuthMiddleware::authenticate();
            require_once __DIR__ . '/controllers/TournamentController.php';
            $controller = new TournamentController();
            break;

        case 'users':
            // require_once __DIR__ . '/middleware/AuthMiddleware.php';
            // AuthMiddleware::authenticate();
            require_once __DIR__ . '/controllers/UserController.php';
            $controller = new UserController();
            break;

        default:
            throw new Exception("Endpoint not found", 404);
    }

    $controller->handleRequest();

} catch (Exception $e) {
    logError($e->getMessage());
    http_response_code($e->getCode() ?: 400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}