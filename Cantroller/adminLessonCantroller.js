import lessonModel from "../models/LessonModel.js";
import { ApiResponse } from "../utils/resPattern.js";


export async function createLesson(req,res,next) {
    try{
        const {title,description,topic,videoUrl,status}=req.body;
    
        const lesson=await lessonModel.create({
            title,description,topic,videoUrl,status
        });
        return res.status(201).json(new ApiResponse(true,"lesson cretaed successfully",lesson));

    }catch(error){
        return res.status(400).json(new ApiResponse(false,null,error.message || "internal sever error"));
    }
    
}

export async function updateLesson(req, res, next) {
  try {
    const data = req.body;
    const updatedLesson = await lessonModel.findByIdAndUpdate(
      req.params.lessonId,data,
      {
        new: true,
        runValidators: true,
      }
    );  
      if (!updatedLesson) {
      return res.status(404).json(
        new ApiResponse(false, null, "Lesson is not found")
      );
    }
    return res.status(200).json(
      new ApiResponse(true, updatedLesson, "Lesson updated successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, null, error.message || "Internal server error")
    );
  }
}

export async function getLesssonById(req,res,next){
   try{
     let lesson=await lessonModel.findById(req.params.id);

    if(!lesson) return res.status(404).json(new ApiResponse(false,null,"lesson not found"));
    
    return res.status(200).json(new ApiResponse(true,"lesson fetched successfully",lesson));

   }catch(error)
   {
    return res.status(500).json(new ApiResponse(false,null,"internal server error"));
   }
}

export async function getAllLessons(req, res, next) {
  try {
    const lessons = await lessonModel.find();

    return res.status(200).json(
      new ApiResponse(true, lessons, "All lessons fetched successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, null, error.message || "Internal server error")
    );
  }
}

// export async function deleLesson(req,res,next) {
//     try{
//         const lesson=await lessonModel.findByIdAndDelete(req.params.id);

//         if(!lesson){
//             return res.status(404).json(new ApiResponse(false,null,"lesson not found"))
//         }
        
//     }catch
//   }