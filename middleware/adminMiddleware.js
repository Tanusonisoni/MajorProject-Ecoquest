import {ApiResponse} from "../utils/resPattern.js";

export default function adminMiddleware(req,res,next){

    console.log("ADMIN MIDDLEWARE HIT");
    console.log("USER ROLE:", req.user?.role);

    if(req.user?.role != "admin"){
        return res.status(403).json(new ApiResponse(
            false,null,"Access denied. Admin only"
        ));
    }
    next();
    
}