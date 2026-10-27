import { v2 as cloudinary } from "cloudinary";
import { ApiResponse } from "../utils/resPattern.js";

export  function generateVideoUploadSignature(req, res, next) {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder: "ecoquest/lesson-videos",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          timestamp,
          signature,
          folder: paramsToSign.folder,
          cloudName: process.env.CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.CLOUDINARY_API_KEY,
        },
        "Video upload signature generated"
      )
    );
  } catch (error) {
    next(error);
  }
}