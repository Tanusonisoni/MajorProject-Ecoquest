
import { Router } from "express";
import { getAdminDashboard } from "../Cantroller/adminDashboardCantroller.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/",authMiddleware,adminMiddleware,getAdminDashboard);

export default router;
