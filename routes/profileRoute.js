
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
    getStudentProfile,
    updateStudentProfile
} from "../Cantroller/studentProfileCantroller.js";

const router = express.Router();

// Get logged-in student's profile
router.get("/profile", authMiddleware, getStudentProfile);

// Update logged-in student's profile
router.patch("/profile", authMiddleware, updateStudentProfile);

export default router;
