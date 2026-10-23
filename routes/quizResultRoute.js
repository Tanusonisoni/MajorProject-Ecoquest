import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { submitQuizAttempt } from "../Cantroller/submitquizAttempt.js";

const router = express.Router();

router.post("/:quizId/submit", authMiddleware, submitQuizAttempt);

export default router;