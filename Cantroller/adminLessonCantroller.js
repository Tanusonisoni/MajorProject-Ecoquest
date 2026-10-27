import { ApiResponse } from "../utils/resPattern.js";
import lessonModel from "../models/LessonModel.js"
import cloudinary from "../Config/cloudinary.js";

// export async function uploadLessonVideo(req, res, next) {
//   try {
//     if (!req.file) {
//       return res.status(400).json(
//         new ApiResponse(false, null, "Select an MP4 or WebM video to upload")
//       );
//     }

//     const uploadedVideo = await new Promise((resolve, reject) => {
//       const stream = cloudinary.uploader.upload_stream(
//         {
//           folder: "ecoquest/lesson-videos",
//           resource_type: "video"
//         },
//         (error, result) => {
//           if (error) return reject(error);
//           if (!result?.secure_url) {
//             return reject(new Error("Cloudinary did not return a secure video URL"));
//           }
//           resolve(result);
//         }
//       );
//       stream.end(req.file.buffer);
//     });

//     return res.status(201).json(
//       new ApiResponse(true, { videoUrl: uploadedVideo.secure_url }, "Lesson video uploaded successfully")
//     );
//   } catch (error) {
//     return next(error);
//   }
// }

export async function uploadLessonVideo(req, res, next) {
  try {
    console.log("1. Video upload request received");

    if (!req.file) {
      return res.status(400).json(
        new ApiResponse(false, null, "Select an MP4 or WebM video to upload")
      );
    }

    console.log("2. Video received:", {
      name: req.file.originalname,
      sizeMB: (req.file.size / (1024 * 1024)).toFixed(2),
      mimetype: req.file.mimetype,
    });

    console.log("3. Starting Cloudinary upload");

    const uploadedVideo = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Cloudinary upload timed out after 120 seconds"));
      }, 300000);

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "ecoquest/lesson-videos",
          resource_type: "video",
        },
        (error, result) => {
          clearTimeout(timer);

          if (error) {
            console.error("Cloudinary error:", error);
            return reject(error);
          }

          if (!result?.secure_url) {
            return reject(
              new Error("Cloudinary did not return a secure video URL")
            );
          }

          console.log("4. Cloudinary upload successful");
          resolve(result);
        }
      );

      stream.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });

      stream.end(req.file.buffer);
    });

    return res.status(201).json(
      new ApiResponse(
        true,
        { videoUrl: uploadedVideo.secure_url },
        "Lesson video uploaded successfully"
      )
    );
  } catch (error) {
    console.error("Video upload failed:", error);
    return next(error);
  }
}

export async function createLesson(req,res,next) {
    try{
        const {title,description,topic,videoUrl,status}=req.body;
    
        const lesson=await lessonModel.create({
            title,description,topic,videoUrl,status
        });
        return res.status(201).json(new ApiResponse(true,lesson,"Lesson created successfully"));

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
    if (req.user?.role !== "admin" && lesson.status !== "published") {
      return res.status(404).json(new ApiResponse(false,null,"lesson not found"));
    }

    return res.status(200).json(new ApiResponse(true,lesson,"lesson fetched successfully"));

   }catch(error)
   {
    return res.status(500).json(new ApiResponse(false,null,"internal server error"));
   }
}

export async function getAllLessons(req, res, next) {
  try {
    const filter = req.user?.role === "admin" ? {} : { status: "published" };
    const lessons = await lessonModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(true, lessons, "All lessons fetched successfully")
    );
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(false, null, error.message || "Internal server error")
    );
  }
}

export async function deleteLesson(req, res, next) {
  try {
    const lesson = await lessonModel.findByIdAndDelete(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json(new ApiResponse(false, null, "Lesson not found"));
    }
    return res.status(200).json(new ApiResponse(true, lesson, "Lesson deleted successfully"));
  } catch (error) {
    next(error);
  }
}
