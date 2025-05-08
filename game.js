import {generateExpression, evaluateExpression} from "./generate.js";
import { createGame, submitNumber, checkScore, getGame } from "./database.js";

export async function startGame(req, res) {
    const { name, difficulty } = req.body

    if (!name || !difficulty || typeof name !== 'string' || typeof difficulty !== 'number') {
        return res.status(400).json({ error: "Name and Numeric difficulty are required" });
    }

    if (difficulty < 1 || difficulty > 4) {
        return res.status(400).json({ error: "Difficulty must be between 1 and 4" });
    }
    let question = generateExpression(difficulty);
    let answer = evaluateExpression(question);
    let game_id = null;
    try {
        game_id = await createGame(name, difficulty, question, answer);
    } catch (error) {
        console.error("Error starting game:", error);
        res.status(500).json({ error: "Internal server error: Error starting game" });
    }

    res.json({
        message: `Hello ${name}, find your submit API URL below:`,
        submit_url: `/game/${game_id}/submit`,
        question: question,
        time_started: new Date().toISOString(),
    })
}

export async function submitAnswer(req, res) {
    const { game_id } = req.params;
    const { answer } = req.body;

    if (!game_id) {
        return res.status(400).json({ error: "Game ID is required" });
    }
    if (!answer || typeof answer !== 'number') {
        return res.status(400).json({ error: "Numeric Answer is required" });
    }
    let game = null;
    try {
        game = await getGameDetails(game_id);
    } catch (error) {
        console.error("Error getting game details:", error);
        return res.status(500).json({ error: "Internal server error: Error getting game details" });
    }
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    let msg = null;
    let correct = false;
    let isCloseEnough = null;
    // Tolerance based float comparison
    let tolerance = 0.002;
    let userAnswer = parseFloat(answer);
    let correctAnswer = parseFloat(game.current_answer);
    let diff = Math.abs(userAnswer - correctAnswer);
    isCloseEnough = diff <= tolerance * Math.abs(correctAnswer);

    if (!isCloseEnough){
        msg = `Sorry ${game.name}, your answer is incorrect`
    }
    else {
        msg = `Good job ${game.name}, your answer is correct!`
        correct = true;
    }

    let time_spent = 0;
    const startTime = new Date(game.time_started);
    const currentTime = new Date();
    if (startTime && !isNaN(startTime.getTime())) {
        time_spent = Math.floor((currentTime - startTime) / 1000);
    }
    try {
        await submitNumber(game_id, game.current_question, answer, correct, time_spent);
    }
    catch (error) {
        console.error("Error submitting answer:", error);
        return res.status(500).json({ error: "Internal server error: Error submitting answer" });
    }
    
    let scoreCheck = await checkGameScore(game_id);
    res.json({
        result: msg,
        time_taken: time_spent + " seconds",
        current_score: scoreCheck.score + " / " + scoreCheck.count_unique, 
        history: scoreCheck.history,
    })
}

export async function checkStatus(req, res) {
    const { game_id } = req.params;
    if (!game_id) {
        return res.status(400).json({ error: "Game ID is required" });
    }
    let game = null
    try {
        game = await getGameDetails(game_id);
    } catch (error) {
        console.error("Error getting game details:", error);
        return res.status(500).json({ error: "Internal server error: Error getting game details" });
    }
    if (!game) {
        return res.status(404).json({ error: "Game not found" });
    }
    let scoreCheck = await checkGameScore(game_id);
    let total_time = scoreCheck.total_time_spent;
    return res.json({
        name: game.name,
        difficulty: game.difficulty,
        current_score: scoreCheck.score + " / " + scoreCheck.history.length,
        total_time_spent: total_time + " minutes",
        history: scoreCheck.history,
    })
}

async function checkGameScore(game_id) {
    try{
        let check = await checkScore(game_id);
        return check
    } catch (error) {
        console.error("Error checking score:", error);
        return { error: "Internal server error: Error checking score" };
    }
}

async function getGameDetails(game_id) {
    try {
        let game = await getGame(game_id);
        return game;
    } catch (error) {
        console.error("Error getting game details:", error);
        return { error: "Internal server error: Error getting game details" };
    }
}