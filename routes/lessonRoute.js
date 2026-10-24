import { Router } from "express";
import { createLesson,updateLesson,getAllLessons,getLesssonById } from "../Cantroller/adminLessonCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router=Router();

router.get("/",authMiddleware,getAllLessons);
router.get("/:id",authMiddleware,getLesssonById);
router.post("/",authMiddleware,adminMiddleware,createLesson);
router.patch("/",authMiddleware,adminMiddleware,updateLesson);


export default router;