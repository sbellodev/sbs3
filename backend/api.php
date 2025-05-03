<?php
require_once __DIR__ . '/config/logger.php';

// CORS Configuration
$allowedOrigins = [
    'http://localhost:3000',
    'https://sbs3.onrender.com'
];

$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($requestOrigin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: " . $requestOrigin);
}

header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Max-Age: 3600");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    require_once __DIR__ . '/config/database.php';

    // Handle path routing for both local and production
    $requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = $_GET['path'] ?? '';

    // Clean up path based on environment
    if (strpos($requestUri, '/sbs3/backend') === 0) {
        // Local development path
        $path = ltrim(str_replace('/sbs3/backend', '', $requestUri), '/');
    } elseif (strpos($requestUri, '/backend') === 0) {
        // Production path
        $path = ltrim(str_replace('/backend', '', $requestUri), '/');
    }

    // Fallback to query string path if still empty
    if (empty($path) && isset($_GET['path'])) {
        $path = $_GET['path'];
    }

    if (empty($path)) {
        echo json_encode(['message' => 'API root - nothing to see here']);
        exit;
    }

    // Extract endpoint from path
    $parts = explode('/', $path);
    $endpoint = $parts[0] ?? '';

    // Route to appropriate controller
    switch ($endpoint) {
        case 'auth':
            require_once __DIR__ . '/controllers/AuthController.php';
            $controller = new AuthController();
            break;

        case 'tournaments':
            require_once __DIR__ . '/controllers/TournamentController.php';
            $controller = new TournamentController();
            break;

        case 'users':
            require_once __DIR__ . '/controllers/UserController.php';
            $controller = new UserController();
            break;

        default:
            throw new Exception("Endpoint not found: " . $endpoint, 404);
    }

    $controller->handleRequest();

} catch (Exception $e) {
    logError($e->getMessage());
    http_response_code($e->getCode() ?: 400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'path' => $path ?? null,
        'requestUri' => $requestUri ?? null
    ]);
}