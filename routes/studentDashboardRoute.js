
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getStudentDashboard } from "../Cantroller/studentDashboardCantroller.js";

const router = express.Router();

router.get(
    "/studashboard",
    authMiddleware,
    getStudentDashboard
);

export default router;
