<?php
require_once __DIR__ . '/../models/TournamentModel.php';

class TournamentController
{
    private $tournamentModel;

    public function __construct()
    {
        $this->tournamentModel = new TournamentModel();
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case 'GET':
                $this->handleGet();
                break;
            case 'POST':
                $this->handlePost();
                break;
            case 'DELETE':
                $this->handleDelete();
                break;
            default:
                throw new Exception("Method not allowed", 405);
        }
    }

    private function handleGet()
    {
        // Get ID if provided in query string
        $id = $_GET['id'] ?? null;

        if ($id) {
            $tournament = $this->tournamentModel->getTournamentById($id);
            if (!$tournament) {
                throw new Exception("Tournament not found", 404);
            }
            echo json_encode([
                'success' => true,
                'data' => $tournament
            ]);
        } else {
            $tournaments = $this->tournamentModel->getAllTournaments();
            echo json_encode([
                'success' => true,
                'data' => $tournaments
            ]);
        }
    }

    private function handlePost()
    {
        // Get raw POST data
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        // Validate JSON
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON data", 400);
        }

        // Validate required fields
        $required = ['name', 'date', 'location'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Missing required field: $field", 400);
            }
        }

        // Create tournament
        $result = $this->tournamentModel->createTournament($data);

        echo json_encode([
            'success' => true,
            'message' => 'Tournament created successfully',
            'data' => $result
        ]);
    }

    private function handleDelete()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception("Missing tournament ID", 400);
        }

        $success = $this->tournamentModel->deleteTournament($id);

        if (!$success) {
            throw new Exception("Failed to delete tournament or tournament not found", 404);
        }

        echo json_encode([
            'success' => true,
            'message' => 'Tournament deleted successfully'
        ]);
    }
}