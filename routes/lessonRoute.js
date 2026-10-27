import { Router } from "express";
import { createLesson,updateLesson,getAllLessons,getLesssonById,deleteLesson,uploadLessonVideo } from "../Cantroller/adminLessonCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { generateVideoUploadSignature } from "../Cantroller/videoUploadCantroller.js";

const router=Router();

router.get("/",authMiddleware,getAllLessons);
router.get("/:id",authMiddleware,getLesssonById);
router.post(
  "/video/signature",
  authMiddleware,
  adminMiddleware,
  generateVideoUploadSignature
);
// router.post("/video",authMiddleware,adminMiddleware,upload.single("video"),uploadLessonVideo);
router.post("/",authMiddleware,adminMiddleware,createLesson);
router.patch("/:lessonId",authMiddleware,adminMiddleware,updateLesson);
router.delete("/:lessonId",authMiddleware,adminMiddleware,deleteLesson);


export default router;