
import ChallengeSubmission from "../models/challengeSubmission.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function getAllSubmissions(req, res, next) {

    console.log("GET ALL SUBMISSIONS CONTROLLER HIT");

    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(
            50,
            Math.max(1, Number(req.query.limit) || 10)
        );
        const skip = (page - 1) * limit;

        const [submissions, total] = await Promise.all([
            ChallengeSubmission.find()
                .populate("studentId", "name email")
                .populate("challengeId", "title description")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            ChallengeSubmission.countDocuments()
        ]);
        return res.status(200).json(
            new ApiResponse(
                true,
                {
                    submissions,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                },
                "Challenge submissions fetched successfully"
            )
        );
    } catch (error) {
    console.error("Get All Submissions Error:", error);
    next(error);
}
}
