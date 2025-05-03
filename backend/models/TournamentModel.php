<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/logger.php';

class TournamentModel
{
    private $conn;

    public function __construct()
    {
        global $conn;
        $this->conn = $conn;
    }

    public function getAllTournaments()
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM tournaments ORDER BY date DESC");
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
            throw new Exception("Failed to fetch tournaments");
        }
    }

    public function getTournamentById($id)
    {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM tournaments WHERE id = ?");
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
            throw new Exception("Failed to fetch tournament");
        }
    }

    public function createTournament($data)
    {
        try {
            $stmt = $this->conn->prepare("INSERT INTO tournaments (name, date, location_id) VALUES (?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("sss", $data['name'], $data['date'], $data['location']);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            return $this->getTournamentById($this->conn->insert_id);
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to create tournament");
        }
    }

    public function updateTournament($id, $data)
    {
        try {
            $stmt = $this->conn->prepare("UPDATE tournaments SET name = ?, date = ?, location = ? WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("sssi", $data['name'], $data['date'], $data['location'], $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            return $this->getTournamentById($id);
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to update tournament");
        }
    }

    public function deleteTournament($id)
    {
        try {
            // First get the tournament before deleting (for returning data)
            $tournament = $this->getTournamentById($id);
            if (!$tournament) {
                throw new Exception("Tournament not found");
            }

            $stmt = $this->conn->prepare("DELETE FROM tournaments WHERE id = ?");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $this->conn->error);
            }

            $stmt->bind_param("i", $id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            return $tournament;
        } catch (Exception $e) {
            logError($e->getMessage());
            throw new Exception("Failed to delete tournament");
        }
    }
}