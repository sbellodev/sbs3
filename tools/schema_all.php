SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE if exists locations;
DROP TABLE if exists tournament_participants;
DROP TABLE if exists tournaments;
DROP TABLE if exists users;

SET FOREIGN_KEY_CHECKS = 1;


-- Users table
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(50) NOT NULL UNIQUE,
email VARCHAR(100) NOT NULL UNIQUE,
role VARCHAR(255) NOT NULL DEFAULT 1,
password_hash VARCHAR(255) NOT NULL,
created_at TIMESTAMP,
updated_at TIMESTAMP
);

ALTER TABLE users
MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Locations table (separate entity for normalization)
CREATE TABLE locations (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
address TEXT,
city VARCHAR(100),
country VARCHAR(100)
);

-- Tournaments table (normalized)
CREATE TABLE tournaments (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(255) NOT NULL,
date DATE NOT NULL,
location_id INT NOT NULL,
organizer_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (organizer_id) REFERENCES users(id),
FOREIGN KEY (location_id) REFERENCES locations(id)
);

ALTER TABLE tournaments
MODIFY created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Participants table (many-to-many relationship)
CREATE TABLE tournament_participants (
tournament_id INT NOT NULL,
user_id INT NOT NULL,
registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (tournament_id, user_id),
FOREIGN KEY (tournament_id) REFERENCES tournaments(id),
FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert test data
INSERT INTO users (username, email, password_hash)
VALUES ('admin', 'admin@example.com', '$2y$10$yourhashedpasswordhere');

INSERT INTO locations (name, city, country)
VALUES ('Madrid Gaming Center', 'Madrid', 'Spain');

INSERT INTO tournaments (name, date, location_id, organizer_id)
VALUES ('Madrid Smash Cup', '2023-10-15', 1, 1);