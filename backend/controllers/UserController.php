<?php
require_once __DIR__ . '/../models/UserModel.php';

class UserController
{
    private $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
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
        $id = $_GET['id'] ?? null;

        if ($id) {
            $user = $this->userModel->getUserById($id);
            if (!$user) {
                throw new Exception("User not found", 404);
            }
            echo json_encode([
                'success' => true,
                'data' => $user
            ]);
        } else {
            $users = $this->userModel->getAllUsers();
            echo json_encode([
                'success' => true,
                'data' => $users
            ]);
        }
    }

    private function handlePost()
    {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON data", 400);
        }

        $required = ['username', 'email', 'role'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new Exception("Missing required field: $field", 400);
            }
        }

        $result = $this->userModel->createUser($data);

        echo json_encode([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $result
        ]);
    }

    private function handleDelete()
    {
        $id = $_GET['id'] ?? null;
        if (!$id) {
            throw new Exception("Missing user ID", 400);
        }

        $success = $this->userModel->deleteUser($id);

        if (!$success) {
            throw new Exception("Failed to delete user or user not found", 404);
        }

        echo json_encode([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}