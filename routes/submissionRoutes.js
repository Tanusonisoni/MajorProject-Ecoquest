import Router from "express";
import upload from "../middleware/uploadMiddleware.js"
import authMiddleware from "../middleware/authMiddleware.js"
import {submitChallengeProof} from "../Cantroller/studentSubmisson.js"

const router=Router();

router.post("/challenges/:challengeId/submit",authMiddleware,upload.single("proof"),submitChallengeProof);

export default router;