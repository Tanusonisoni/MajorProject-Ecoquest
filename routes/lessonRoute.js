import { Router } from "express";
import { createLesson,updateLesson,getAllLessons,getLesssonById } from "../Cantroller/adminLessonCantroller.js";

const router=Router();

router.get("/",getAllLessons);
router.get("/:id",getLesssonById);
router.post("/",createLesson);
router.patch("/",updateLesson);


export default router;