
import ChallengeSubmission from "../models/challengeSubmission.js";
import { ApiResponse } from "../utils/resPattern.js";
import notificationModel from "../models/notificationModel.js";

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

export async function reviewSubmission(req, res, next) {

    console.log("REVIEW SUBMISSION CONTROLLER HIT");

    try {
        const { status, marks, feedback } = req.body;
        const { submissionId } = req.params;

        // Validate status
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json(
                new ApiResponse(
                    false,
                    null,
                    "Status must be approved or rejected"
                )
            );
        }

        // Validate marks
        if (
            marks !== undefined &&
            (!Number.isFinite(Number(marks)) || Number(marks) < 0)
        ) {
            return res.status(400).json(
                new ApiResponse(false, null, "Marks must be a non-negative number")
            );
        }

        const submission = await ChallengeSubmission.findById(submissionId);

        if (!submission) {
            return res.status(404).json(
                new ApiResponse(false, null, "Submission not found")
            );
        }

        submission.status = status;

        if (marks !== undefined) {
            submission.marks = Number(marks);
        }

        if (feedback !== undefined) {
            submission.feedback = feedback;
        }

        await submission.save();

        // Create notification for the student
        await notificationModel.create({
            userId: submission.studentId,
            title: status === "approved"
                ? "Challenge Approved"
                : "Challenge Rejected",
            message: status === "approved"
                ? "Your challenge submission has been approved."
                : "Your challenge submission has been rejected.",
            type: "challenge_review",
            isRead: false
        });

        return res.status(200).json(
            new ApiResponse(
                true,
                submission,
                "Submission reviewed successfully"
            )
        );
    } catch (error) {
        next(error);
    }
}
