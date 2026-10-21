import userModel from "../models/userModel.js";

export default async function authMiddleware(req,res,next) {
    try{
        const token=req.header.authMiddleware?.split(" ")[1];
        if(!token)
        {
            return res.status(401).json(new ApiResponse(false,null,"unauthorize"));
        }
        let tokenData=verifytoken(token);
        if(!tokenData)
        {
            return res.status(401).json(new ApiResponse(false,null,"unauthorize or invalid tokken"));
        }
    if (userModel.isActive === false){
        return res.status(403).json(new ApiResponse(false,null,"account not  found"))
    }

    user=user.toObject();

    delete user.password;
    delete user.isDeleted;
    delete user.__v;

    req.user=user;
    next();
    }catch(error)
    {
        console.log('Error in authmiddleware:',error);
        return res.status(500).json(new ApiResponse(false,null,"internal server error"))
    }
}