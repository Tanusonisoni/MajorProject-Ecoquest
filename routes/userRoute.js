import Router from "express";
import {
  getAllUsers,
  getUserById,
  registerUser,
  deleteUser,
  updateUser
} from "../Cantroller/registerCantroller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = Router();

// Public registration
router.post("/", registerUser);

// Admin-only routes
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.get("/:id", authMiddleware, adminMiddleware, getUserById);
router.patch("/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;