
import Quiz from "../models/quizModel.js";
import quizResultModel from "../models/quizResult.js";
import { ApiResponse } from "../utils/resPattern.js";
import { emitLeaderboardUpdate } from "../utils/emitLeaderboardUpdate.js";

export async function submitQuizAttempt(req, res, next) {
    try {
        const { quizId } = req.params;
        const { answers } = req.body;

        const studentId = req.user?._id || req.user?.id;

        if (!studentId) {
            return res.status(401).json(
                new ApiResponse(false, null, "Student authentication required")
            );
        }

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json(
                new ApiResponse(false, null, "Answers are required")
            );
        }

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json(
                new ApiResponse(false, null, "Quiz not found")
            );
        }

        if (quiz.status !== "published") {
            return res.status(400).json(
                new ApiResponse(false, null, "This quiz is not published")
            );
        }

        const existingResult = await quizResultModel.findOne({
            quizId: quiz._id,
            studentId
        });

        if (existingResult) {
            return res.status(409).json(
                new ApiResponse(
                    false,
                    null,
                    "You have already attempted this quiz"
                )
            );
        }

        let score = 0;
        const checkedAnswers = [];

        for (const answer of answers) {
            const question = quiz.questions.id(answer.questionId);

            if (!question) {
                return res.status(400).json(
                    new ApiResponse(false, null, "Invalid question ID")
                );
            }

            if (
                typeof answer.selectedAnswer !== "string" ||
                !question.options.includes(answer.selectedAnswer)
            ) {
                return res.status(400).json(
                    new ApiResponse(false, null, "Invalid selected answer")
                );
            }

            const isCorrect =
                answer.selectedAnswer === question.correctAnswer;

            if (isCorrect) {
                score += 5;
            }

            checkedAnswers.push({
                questionId: question._id,
                selectedAnswer: answer.selectedAnswer,
                isCorrect
            });
        }

        const result = await quizResultModel.create({
            quizId: quiz._id,
            lessonId: quiz.lessonId,
            studentId,
            answers: checkedAnswers,
            score,
            totalMarks: quiz.questions.length * 5
        });

        const io = req.app.get("io");
        await emitLeaderboardUpdate(io);

        return res.status(201).json(
            new ApiResponse(
                true,
                {
                    quizId: quiz._id,
                    score,
                    totalMarks: quiz.questions.length * 5,
                    correctAnswers: checkedAnswers.filter(
                        answer => answer.isCorrect
                    ).length,
                    totalQuestions: quiz.questions.length,
                    resultId: result._id
                },
                "Quiz submitted successfully"
            )
        );
    } catch (error) {
        next(error);
    }
}
