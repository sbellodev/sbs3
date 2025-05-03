<?php
require_once __DIR__ . '/../models/UserModel.php';

class AuthController
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
            case 'POST':
                $this->login();
                break;
            default:
                throw new Exception("Method not allowed", 405);
        }
    }

    private function login()
    {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data)
            throw new Exception("Invalid input");

        $user = $this->userModel->authenticate($data['email'], $data['password']);
        if (!$user)
            throw new Exception("Invalid credentials", 401);

        // Generate JWT token (simplified example)
        $token = base64_encode(json_encode([
            'user_id' => $user['id'],
            'exp' => time() + 3600
        ]));

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username']
            ]
        ]);
    }
}