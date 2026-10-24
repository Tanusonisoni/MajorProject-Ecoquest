
import userModel from "../models/userModel.js";
import QuizResult from "../models/quizResult.js";
import ChallengeSubmission from "../models/challengeSubmission.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function getLeaderboard(req, res, next) {
    try {
        // Get active students
        const students = await userModel.find({
            role: "student",
            status: "active"
        }).select("_id name");

        const leaderboard = await Promise.all(
            students.map(async (student) => {
                // Calculate total quiz marks
                const quizResults = await QuizResult.find({
                    studentId: student._id
                }).select("score");

                const quizMarks = quizResults.reduce(
                    (total, result) => total + result.score,
                    0
                );

                // Calculate only approved challenge marks
                const approvedSubmissions = await ChallengeSubmission.find({
                    studentId: student._id,
                    status: "approved"
                }).select("marks");

                const challengeMarks = approvedSubmissions.reduce(
                    (total, submission) => total + submission.marks,
                    0
                );

                return {
                    studentId: student._id,
                    name: student.name,
                    quizMarks,
                    challengeMarks,
                    totalMarks: quizMarks + challengeMarks
                };
            })
        );

        // Highest score first; break ties by name
        leaderboard.sort((a, b) =>
            b.totalMarks - a.totalMarks ||
            a.name.localeCompare(b.name)
        );

        const topStudents = leaderboard
            .slice(0, 10)
            .map((student, index) => ({
                rank: index + 1,
                ...student
            }));

        return res.status(200).json(
            new ApiResponse(
                true,
                topStudents,
                "Leaderboard fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
}
