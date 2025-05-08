import express from "express"
import { startGame, submitAnswer, checkStatus } from "./game.js";
const router = express.Router();

router.post("/game/start", startGame)
router.post("/game/:game_id/submit", submitAnswer)
router.get("/game/:game_id/status", checkStatus)

export default router;