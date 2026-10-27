import challengeModel from "../models/challangeModel.js";
import { ApiResponse } from "../utils/resPattern.js";
import cloudinary from "../Config/cloudinary.js";

export async function createChallange(req,res,next){
    try{
        const {title,description,lessonId,instructions,status,marks}=req.body;

        if(!title || !description || !lessonId || !instructions){
            return res.status(400).json(new ApiResponse(false,null,"all fields are required"));
        }
        const challenge= await challengeModel.create({
            title,description,lessonId,instructions,status,marks,
            createdBy: req.user?._id
        });

        return res.status(201).json(new ApiResponse(true,challenge,"challenge create successfully"))
    }catch(error){
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"))
    }
}
export async function getAllChallenge(req,res,next) {
    try{
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 25));
        const skip = (page - 1) * limit;

        const filter = req.user?.role === "admin" ? {} : { status: "published" };
        const [challenge, totalChallenge] = await Promise.all([
            challengeModel.find(filter)
                .populate("createdBy", "name email")
                .populate("lessonId", "title topic")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            challengeModel.countDocuments(filter)
        ]);

        res.status(200).json(new ApiResponse(true, {
            challenge,
            pagination: {
                total: totalChallenge,
                page,
                limit,
                totalPages: Math.ceil(totalChallenge / limit)
            }
        }, "Challenges fetched successfully"));

    }catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message||"internal sever error"))
    }
}

export  async function getchallengeById(req,res,next){
    try{
        const challange=await challengeModel.findById(req.params.id)
            .populate("lessonId", "title topic");
        if(!challange) return res.status(404).json(new ApiResponse(false,null,"challenge not found"));
        if (req.user?.role !== "admin" && challange.status !== "published") {
            return res.status(404).json(new ApiResponse(false,null,"challenge not found"));
        }

        return res.status(200).json(new ApiResponse(true,challange,"find successfully"));


    }catch(error){
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"
        ))
    }
}
export async function updateChallenge(req,res,next){
    try{
        const newChallenge=await challengeModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
    
        if(!newChallenge) return res.status(400).json(new ApiResponse(false,null,"challenge not found"));

        return res.status(200).json(new ApiResponse(true,newChallenge,"challenge get updated"));
    }catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null,error.message || "intenal server error"));
    }
}

export async function deleteChallenge(req,res,next){
    try{
        const deleteChallenge=await challengeModel.findByIdAndDelete(req.params.id);
        if(!deleteChallenge) return res.status(400).json(new ApiResponse(false,null,"challenge nt foudn"));
         
        return res.status(200).json(new ApiResponse(true,deleteChallenge,"challenge deleted"));
    }catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}