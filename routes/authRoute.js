import Router from "express";
import { authCantroller } from "../Cantroller/authCantroller.js"


const router=Router();

router.post("/login",authCantroller);
router.post("/admin-login",authCantroller)

export default router;