import Router from "express";
import upload from "../middleware/uploadMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js"
import {getMySubmissions, submitChallengeProof} from "../Cantroller/studentSubmisson.js"

const router=Router();

router.get("/my-submissions",authMiddleware,getMySubmissions);
router.post("/challenges/:challengeId/submit",authMiddleware,upload.single("proof"),submitChallengeProof);

export default router;