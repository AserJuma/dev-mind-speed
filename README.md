# DevMindSpeed Math Game API

## Overview

Features:

- Generate random arithmetic equations with adjustable difficulty levels
- Answer submission and validation
- Score tracking and game history and time tracking

## Installation

1. Clone the repository:
   ```
   git clone <repo-url>
   cd dev-mind-speed
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Adjust local .env variables in the directory with the following variables:
   ```
   PORT=8080
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   ```

4. Create the required MySQL tables: (or run the SQL file)
   ```sql
   CREATE TABLE games (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     difficulty INT NOT NULL,
     current_question TEXT NOT NULL,
     current_answer FLOAT NOT NULL,
     time_started TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE game_history (
     id INT AUTO_INCREMENT PRIMARY KEY,
     game_id INT NOT NULL,
     question VARCHAR(255) NOT NULL,
     given_answer FLOAT NOT NULL,
     correct BOOLEAN NOT NULL,
     time_taken DECIMAL NOT NULL,
     FOREIGN KEY (game_id) REFERENCES games(id)
   );
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Examples

### Start a New Game
```
POST /game/start
```

Request Body:
```json
{
  "name": "Aser",
  "difficulty": 1
}
```

Response:
```json
{
    "message": "Hello Aser, find your submit API URL below:",
    "submit_url": "/game/9/submit",
    "question": "2 + 8",
    "time_started": "2025-05-08T07:00:19.168Z"
}
```

Request Body:
```json
{
  "answer": 10
}
```

Response:
```json
{
    "result": "Good job Aser, your answer is correct!",
    "time_taken": "76 seconds",
    "current_score": "1 / 1",
    "history": [
        {
            "question": "2 + 8",
            "given_answer": 10,
            "correct": "True",
            "time_taken": "76 seconds"
        }
    ]
}
```
Status Response:
```json
{
    "name": "Aser",
    "difficulty": 1,
    "current_score": "1 / 1",
    "total_time_spent": "1.27 minutes",
    "history": [
        {
            "question": "2 + 8",
            "given_answer": 10,
            "correct": "True",
            "time_taken": "76 seconds"
        }
    ]
}
```

```
POST /game/start
```

Request Body:
```json
{
  "name": "Aser",
  "difficulty": 4
}
```

- `name`: Player's name (string)
- `difficulty`: Level from 1-4 (number)

Response:
```json
{
    "message": "Hello Aser, find your submit API URL below:",
    "submit_url": "/game/10/submit",
    "question": "8867 * 8034 * 5730 * 7525 / 5309",
    "time_started": "2025-05-08T07:07:04.609Z"
}
```

Response:
```json
{
    "result": "Sorry Aser, your answer is incorrect",
    "time_taken": "196 seconds",
    "current_score": "1 / 1",
    "history": [
        {
            "question": "8867 * 8034 * 5730 * 7525 / 5309",
            "given_answer": 55,
            "correct": "False",
            "time_taken": "196 seconds"
        }
    ]
}
```

Response:
```json
{
    "result": "Good job Aser, your answer is correct!",
    "time_taken": "270 seconds",
    "current_score": "1 / 1",
    "history": [
        {
            "question": "8867 * 8034 * 5730 * 7525 / 5309",
            "given_answer": 55,
            "correct": "False",
            "time_taken": "196 seconds"
        },
        {
            "question": "8867 * 8034 * 5730 * 7525 / 5309",
            "given_answer": 578571000000,
            "correct": "True",
            "time_taken": "270 seconds"
        }
    ]
}

{
    "name": "Faris",
    "difficulty": 1,
    "current_score": "1 / 2",
    "total_time_spent": "2.32 minutes",
    "history": [
        {
            "question": "4 * 8",
            "given_answer": 555,
            "correct": "False",
            "time_taken": "57 seconds"
        },
        {
            "question": "4 * 8",
            "given_answer": 32,
            "correct": "True",
            "time_taken": "82 seconds"
        }
    ]
}
```

## Difficulty Levels

The game offers four difficulty levels that affect:
- The size of numbers used in the expressions are difficulty based.
- The number of operations in each expression are proportional

Difficulty breakdown: (1-9, 10-99, 100-999, or 1000-9999)
- Level 1: Two operands with single-digit numbers
- Level 2: Three operands with double-digit numbers
- Level 3: Four operands with triple-digit numbers
- Level 4: Five operands with quadruaple-digit numbers

## Features

- **Expression Generation**: Creates random arithmetic expressions using +, -, *, and / operators
- **Answer Validation**: Validates user answers with a small tolerance for floating-point precision
- **Game History**: Tracks all submissions with questions, answers, and time taken
- **Performance Metrics**: Provides statistics on correct answers and time spent

## Error Handling

- Input validation
- Checking record(s) existence
- Database connection issues
- Expression evaluation errors

## Design Choices

Architecture
File Structure: Codebase follows a modular design with a regular separation of concerns in the spirit of 'scaling', and cleanliness. Extra folder use wasn't done due to the small size of the task.

Database Design (Relational)

Two-Table Structure: Using two separate tables is an arbitrary choice. The main table acts as a starting point to hold relevant information, and submissions/checks go to the secondary table. Complexity of queries was kept to a minimum.

Game Logic

Difficulty Scaling: The difficulty parameter controls both number size and expression complexity.
Score is calculated from game history, checking which questions were answered correctly, what was the number of unique questions, and total questions. At first there was a score column in the initial main table, but that proved unnecessary. 

Security Considerations

Input Validation: Basic input validation is performed but could be enhanced with more comprehensive sanitization.
Queries: Prepared Statement used for more reliability.
Type Safety: More can be done to reinforce type-safety.
