import Router from "express";
import { authCantroller } from "../Cantroller/authCantroller.js"
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router=Router();

router.post("/login",authCantroller);
router.post("/admin-login",authCantroller)

export default router;