
import express from "express";
import { getAllSubmissions, reviewSubmission } from "../Cantroller/adminCheckSubmission.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllSubmissions);
router.patch("/:submissionId/review",authMiddleware,adminMiddleware,reviewSubmission);

export default router;
