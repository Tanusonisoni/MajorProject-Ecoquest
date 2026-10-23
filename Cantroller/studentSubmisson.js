
import challengeModel from "../models/challangeModel.js";
import ChallengeSubmission from "../models/ChallengeSubmission.js";
import cloudinary from "../Config/cloudinary.js";
import {ApiResponse} from "../utils/resPattern.js";

function uploadProof(file) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "ecoquest/challenge-proofs",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(file.buffer);
  });
}

export async function submitChallengeProof(req, res, next) {
  try {
    const { challengeId } = req.params;

    if (!req.file) {
      return res.status(400).json(
        new ApiResponse(false, null, "Please upload an image or video")
      );
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json(
        new ApiResponse(false, null, "Only supported images and videos are allowed")
      );
    }

    const challenge = await challengeModel.findById(challengeId);

    if (!challenge) {
      return res.status(404).json(
        new ApiResponse(false, null, "Challenge not found")
      );
    }

    if (challenge.status !== "published") {
      return res.status(400).json(
        new ApiResponse(false, null, "This challenge is not published")
      );
    }

    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      return res.status(401).json(
        new ApiResponse(false, null, "Student authentication required")
      );
    }

    const uploadedFile = await uploadProof(req.file);

    const submission = await ChallengeSubmission.create({
      challengeId,
      studentId,
      proofUrl: uploadedFile.secure_url,
      proofType: req.file.mimetype.startsWith("image/")
        ? "image"
        : "video"
    });

    return res.status(201).json(
      new ApiResponse(
        true,
        submission,
        "Challenge proof submitted successfully"
      )
    );
  } catch (error) {
    next(error);
  }
}
