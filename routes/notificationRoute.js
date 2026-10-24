import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead
} from "../Cantroller/notificationCantroller.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markNotificationRead);

export default router;