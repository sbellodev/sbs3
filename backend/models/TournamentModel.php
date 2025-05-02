<?php
require_once __DIR__ . '/../config/database.php';

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
        $sql = "SELECT * FROM tournaments";
        $result = $this->conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function createTournament($name, $date, $location)
    {
        try {
            $stmt = $this->conn->prepare("INSERT INTO tournaments (name, date, location) VALUES (?, ?, ?)");
            if (!$stmt)
                throw new Exception("Prepare failed: " . $this->conn->error);

            $stmt->bind_param("sss", $name, $date, $location);
            if (!$stmt->execute())
                throw new Exception("Execute failed: " . $stmt->error);

            return $this->conn->insert_id;
        } catch (Exception $e) {
            logError($e->getMessage());
            throw $e;
        }
    }

    public function deleteTournament($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM tournaments WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
    }
}
?>