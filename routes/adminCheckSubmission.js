
import express from "express";
import { getAllSubmissions } from "../Cantroller/adminCheckSubmission.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllSubmissions);

export default router;
