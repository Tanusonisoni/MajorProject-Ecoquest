import { Router } from "express";
import  {createChallange, getAllChallenge,getchallengeById, updateChallenge,deleteChallenge} from "../Cantroller/adminChllangeCantroller.js"

const routes=Router();

routes.get("/",getAllChallenge);
routes.get("/:id",getchallengeById);
routes.post("/",createChallange);
routes.patch("/:id",updateChallenge);
routes.delete("/:id",deleteChallenge);


export default routes;
