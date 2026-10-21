import Router from "express";
import { createQuiz,deleteQuestion,deleteQuiz,getQuiz } from "../Cantroller/adminQuizCantroller.js";

const router=Router();
router.post("/",createQuiz);
router.get("/:id",getQuiz);
router.delete("/:id",deleteQuiz)
router.delete("/:id/question/:questionId",deleteQuestion)

export default router;

