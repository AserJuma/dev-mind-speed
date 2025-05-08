import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
}).promise()

export async function getGame(game_id) {
    const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [game_id]);
    return rows[0];
}

export async function createGame(name, difficulty, question, answer) {
    const [rows] = await pool.query(
        'INSERT INTO games (name, difficulty, current_question, current_answer) VALUES (?, ?, ?, ?)',
        [name, difficulty, question, answer]
    );
    return rows.insertId;
}

export async function submitNumber(game_id, question, answer, correct, time_spent) {
    const [rows] = await pool.query(
        'INSERT INTO game_history (game_id, question, given_answer, correct, time_taken) VALUES (?, ?, ?, ?, ?)',
        [game_id, question, answer, correct, time_spent]
    );
}

export async function checkScore(game_id) {
    const [history] = await pool.query('SELECT * FROM game_history WHERE game_id = ?', [game_id]);
    let score = history.filter(item => item.correct).length
    let total_time_spent = (history.reduce((acc, item) => acc + parseInt(item.time_taken), 0) / 60).toFixed(2)
    let history_data = history.map((item) => {
        return {
            question: item.question,
            given_answer: item.given_answer,
            correct: item.correct ? "True" : "False",
            time_taken: item.time_taken + " seconds",
        }
    })
    let unique_questions_count = [...new Set(history.map(item => item.question))].length
    return {
        score: score,
        history: history_data,
        total_time_spent: total_time_spent,
        count_unique: unique_questions_count,
    }
}




