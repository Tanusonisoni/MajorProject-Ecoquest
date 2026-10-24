import { Router } from "express";
import  {createChallange, getAllChallenge,getchallengeById, updateChallenge,deleteChallenge} from "../Cantroller/adminChllangeCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const routes=Router();

routes.get("/",authMiddleware,getAllChallenge);
routes.get("/:id",authMiddleware,getchallengeById);
routes.post("/",authMiddleware,adminMiddleware,createChallange);
routes.patch("/:id",authMiddleware,adminMiddleware,updateChallenge);
routes.delete("/:id",authMiddleware,adminMiddleware,deleteChallenge);


export default routes;
