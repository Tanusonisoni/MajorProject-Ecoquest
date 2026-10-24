
export async function emitLeaderboardUpdate(io) {
    if (!io) return;

    try {
        const userModel = (await import("../models/userModel.js")).default;
        const QuizResult = (await import("../models/quizResult.js")).default;
        const ChallengeSubmission = (await import("../models/challengeSubmission.js")).default;

        const students = await userModel.find({
            role: "student",
            status: "active"
        }).select("_id name");

        const leaderboard = await Promise.all(
            students.map(async (student) => {
                const quizResults = await QuizResult.find({
                    studentId: student._id
                }).select("score");

                const quizMarks = quizResults.reduce(
                    (total, result) => total + (Number(result.score) || 0),
                    0
                );

                const approvedSubmissions = await ChallengeSubmission.find({
                    studentId: student._id,
                    status: "approved"
                }).select("marks");

                const challengeMarks = approvedSubmissions.reduce(
                    (total, submission) =>
                        total + (Number(submission.marks) || 0),
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

        leaderboard.sort(
            (a, b) =>
                b.totalMarks - a.totalMarks ||
                a.name.localeCompare(b.name)
        );

        const topStudents = leaderboard
            .slice(0, 10)
            .map((student, index) => ({
                rank: index + 1,
                ...student
            }));

        io.emit("leaderboard:update", topStudents);
    } catch (error) {
        console.error("Leaderboard socket update failed:", error);
    }
}
