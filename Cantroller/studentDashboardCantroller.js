
import QuizResult from "../models/quizResult.js";
import ChallengeSubmission from "../models/challengeSubmission.js";
import Lesson from "../models/LessonModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function getStudentDashboard(req, res, next) {
    try {
        const studentId = req.user?._id || req.user?.id;

        if (!studentId) {
            return res.status(401).json(
                new ApiResponse(
                    false,
                    null,
                    "Student authentication required"
                )
            );
        }
        // Only published lessons count toward progress
        const totalLessons = await Lesson.countDocuments({
            status: "published"
        });

        // Fetch student's quiz results
        const quizResults = await QuizResult.find({ studentId });

        const quizMarks = quizResults.reduce(
            (total, result) => total + result.score,
            0
        );

        // Only approved challenge submissions earn marks
        const approvedSubmissions = await ChallengeSubmission.find({
            studentId,
            status: "approved"
        });

        const challengeMarks = approvedSubmissions.reduce(
            (total, submission) => total + submission.marks,
            0
        );

        // Unique lessons with quiz results or approved challenges
        const completedLessonIds = new Set([
            ...quizResults.map(result => result.lessonId.toString()),
        ]);

        const approvedChallengeIds = await ChallengeSubmission.find({
            studentId,
            status: "approved"
        }).populate("challengeId", "lessonId");

        approvedChallengeIds.forEach(submission => {
            if (submission.challengeId?.lessonId) {
                completedLessonIds.add(
                    submission.challengeId.lessonId.toString()
                );
            }
        });

        const completedLessons = completedLessonIds.size;

        const maxPossibleMarks = totalLessons * 70;
        const totalMarks = quizMarks + challengeMarks;

        const progressPercentage = totalLessons > 0
            ? Number(
                ((completedLessons / totalLessons) * 100).toFixed(2)
              )
            : 0;

        return res.status(200).json(
            new ApiResponse(
                true,
                {
                    totalMarks,
                    maxPossibleMarks,
                    quizMarks,
                    challengeMarks,
                    completedLessons,
                    totalLessons,
                    progressPercentage
                },
                "Student dashboard fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
}
