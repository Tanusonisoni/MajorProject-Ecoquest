import challengeModel from "../models/challangeModel.js";
import { ApiResponse } from "../utils/resPattern.js";
import cloudinary from "../Config/cloudinary.js";

export async function createChallange(req,res,next){
    try{
        const {title,description,lessonId,instructions,status}=req.body;

        if(!title || !description || !lessonId || !instructions){
            return res.status(400).json(new ApiResponse(false,null,"all fields are required"));
        }
        const challenge= await challengeModel.create({
            title,description,lessonId,instructions,status
        });

        return res.status(201).json(new ApiResponse(true,challenge,"challenge create successfully"))
    }catch(error){
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"))
    }
}
export async function getAllChallenge(req,res,next) {
    try{
        let page=req.query.page > 0 ? req.query.page :1;
        let limit=req.query.limit <= 100 ? req.query.limit : 25
        let skip = page===1 ? 0 :(page-1)*limit;

        let challenge = await challengeModel.find()
        .populate("createdBy","name email role_id")
        .skip(skip)
        .limit(limit)
        .sort({createdAt:-1});

        let totalChallenge=await challengeModel.countDocuments();

        res.status(200).json(new ApiResponse(true,{page,limit,totalChallenge,challenge},"success"));

    }catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message||"internal sever error"))
    }
}

export  async function getchallengeById(req,res,next){
    try{
        const challange=await challengeModel.findById(req.params.id);
        if(!challange) return res.status(404).json(new ApiResponse(false,null,"challenge not found"));

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