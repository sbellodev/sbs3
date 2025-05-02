<?php
// Enable debugging
require_once __DIR__ . '/config/logger.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

try {
    require_once __DIR__ . '/config/database.php';
    require_once __DIR__ . '/models/TournamentModel.php';

    $method = $_SERVER['REQUEST_METHOD'];
    $model = new TournamentModel();

    // GET /tournaments
    if ($method === 'GET' && isset($_GET['action']) && $_GET['action'] === 'tournaments') {
        echo json_encode([
            'success' => true,
            'data' => $model->getAllTournaments()
        ]);
        exit;
    }

    // POST /tournaments
    if ($method === 'POST' && isset($_GET['action']) && $_GET['action'] === 'tournaments') {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input)
            throw new Exception("Invalid JSON input");

        $id = $model->createTournament($input['name'], $input['date'], $input['location']);
        echo json_encode(['success' => true, 'id' => $id]);
        exit;
    }

    // DELETE /tournaments
    if ($method === 'DELETE' && isset($_GET['action']) && $_GET['action'] === 'tournaments') {
        $id = $_GET['id'] ?? null;
        if (!$id)
            throw new Exception("Missing ID");

        $model->deleteTournament($id);
        echo json_encode(['success' => true]);
        exit;
    }

    throw new Exception("Invalid request");

} catch (Exception $e) {
    logError($e->getMessage()); // Log to debug.log
    http_response_code(400); // Bad request
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage() // Output to terminal/frontend
    ]);
}
?>