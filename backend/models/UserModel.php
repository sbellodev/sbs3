<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/logger.php';

class UserModel
{
    private $conn;

    public function __construct()
    {
        global $conn;
        $this->conn = $conn;
    }

    public function authenticate($email, $password)
    {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if ($user && password_verify($password, $user['password_hash'])) {
            return $user;
        }
        return false;
    }

    public function getAllUsers()
    {
        try {
            $stmt = $this->conn->prepare("SELECT id, username, email, role FROM users ORDER BY username");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $result = $stmt->get_result();
            return $result->fetch_all(MYSQLI_ASSOC);
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to fetch users");
        }
    }

    public function getUserById($id)
    {
        try {
            $stmt = $this->conn->prepare("SELECT id, username, email, role FROM users WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $result = $stmt->get_result();
            return $result->fetch_assoc();
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to fetch user");
        }
    }

    public function createUser($data)
    {
        try {
            $stmt = $this->conn->prepare("INSERT INTO users (username, email, role) VALUES (?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("sss", $data['username'], $data['email'], $data['role']);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            return $this->getUserById($this->conn->insert_id);
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to create user");
        }
    }

    public function deleteUser($id)
    {
        try {
            $user = $this->getUserById($id);
            if (!$user) {
                throw new Exception("User not found");
            }

            $stmt = $this->conn->prepare("DELETE FROM users WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            return $user;
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to delete user");
        }
    }
}