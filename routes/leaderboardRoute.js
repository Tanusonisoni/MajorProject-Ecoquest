
import express from "express";
import { getLeaderboard } from "../Cantroller/learderBoardCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/",authMiddleware,getLeaderboard);

export default router;
