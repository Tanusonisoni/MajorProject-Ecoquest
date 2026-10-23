import Router from "express";
import { getAllUsers, getUserById, registerUser,deleteUser,updateUser} from "../Cantroller/registerCantroller.js";

const router=Router();

router.get("/",getAllUsers)
router.get("/:id",getUserById);
router.post("/",registerUser);
router.patch("/:id",updateUser);
router.delete("/:id",deleteUser);

export default router;