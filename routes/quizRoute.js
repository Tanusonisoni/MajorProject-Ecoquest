import Router from "express";
import { createQuiz,deleteQuestion,deleteQuiz,getQuiz } from "../Cantroller/adminQuizCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router=Router();
router.get("/:id",authMiddleware,getQuiz);
router.post("/",authMiddleware, adminMiddleware,createQuiz);
router.delete("/:id",authMiddleware, adminMiddleware,deleteQuiz)
router.delete("/:id/question/:questionId",authMiddleware, adminMiddleware,deleteQuestion)

export default router;

