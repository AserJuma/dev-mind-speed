CREATE DATABASE dev_mind;
USE dev_mind;

CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 4),
    current_question TEXT NOT NULL,
    current_answer FLOAT NOT NULL,
    time_started DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE game_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    question TEXT NOT NULL,
    given_answer FLOAT NOT NULL,
    correct BOOLEAN NOT NULL,
    time_taken DECIMAL NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);