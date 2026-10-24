import Router from "express";
import { authCantroller } from "../Cantroller/authCantroller.js"
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router=Router();

router.post("/login",authMiddleware,authCantroller);
router.post("/admin-login",adminMiddleware,adminMiddleware,authCantroller)

export default router;