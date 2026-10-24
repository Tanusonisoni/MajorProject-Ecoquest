
import lessonModel from "../models/lessonModel.js";
import quizModel from "../models/quizModel.js";
import challangeModel from "../models/challangeModel.js";
import userModel from "../models/userModel.js";
import challengeSubmissionModel from "../models/challengeSubmission.js";
import quizResult from "../models/quizResult.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function getAdminDashboard(req, res, next) {
  try {
    const [
      totalLessons,
      totalQuizzes,
      totalChallenges,
      totalStudents,
      activeStudents,
      totalQuizResults,
      pendingSubmissions
    ] = await Promise.all([
      lessonModel.countDocuments(),
      quizModel.countDocuments(),
      challangeModel.countDocuments(),
      userModel.countDocuments({ role: "student" }),
      userModel.countDocuments({
        role: "student",
        status: "active"
      }),
      quizResult.countDocuments(),
      challengeSubmissionModel.countDocuments({
        status: "pending"
      })
    ]);

    return res.status(200).json(
      new ApiResponse(
        true,
        {
          totalLessons,
          totalQuizzes,
          totalChallenges,
          totalStudents,
          activeStudents,
          totalQuizResults,
          pendingSubmissions
        },
        "Admin dashboard data fetched successfully"
      )
    );
  } catch (error) {
    next(error);
  }
}
