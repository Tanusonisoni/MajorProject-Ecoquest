import quizModel from "../models/quizModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function getAllQuizzes(req, res, next) {
    try {
        const filter = req.user?.role === "admin" ? {} : { status: "published" };
        const quizzes = await quizModel.find(filter)
            .select("title lessonId status createdAt questions.questionText")
            .populate("lessonId", "title topic")
            .sort({ createdAt: -1 });

        return res.status(200).json(
            new ApiResponse(true, quizzes, "Quizzes fetched successfully")
        );
    } catch (error) {
        next(error);
    }
}

export async function  createQuiz(req,res,next) {
    try{
        const quiz= await quizModel.create(req.body);

    return res.status(200).json(new ApiResponse(true,quiz,"quiz created sucessfully"));
    
    }catch(error){
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}

export async function getQuiz(req,res,next) {
    try{
        const quiz=await quizModel.findById(req.params.id);
        if(!quiz){
            return res.status(404).json(new ApiResponse(false,null,"quiz not found"));
        }
        if (req.user?.role !== "admin" && quiz.status !== "published") {
            return res.status(404).json(new ApiResponse(false,null,"quiz not found"));
        }
        const result = quiz.toObject();
        if (req.user?.role !== "admin") {
            result.questions = result.questions.map(({ correctAnswer, ...question }) => question);
        }
        return res.status(200).json(new ApiResponse(true,result,"quiz fetch sucessfully"));
    }catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}

export async function deleteQuiz(req,res,next){
    try{
        const quiz=await quizModel.findByIdAndDelete(req.params.id);

        if(!quiz){
            return res.status(404).json(new ApiResponse(false,null,"quiz not found"));

        }
        return res.status(200).json(new ApiResponse(true,quiz,"quiz deleted sucessfully"));
    }catch(error){
        return res.status(500).json(new ApiResponse(false,null,error.message || "internale server error"))
    }
}

// export async function deleteQuestion(req,res,next){
//     try{
//         const quiz=await quizModel.findById(req.params.id);
//         if(!quiz){
//             return res.status(404).json(new ApiResponse(false,null,"quiz not found"));
//         }
//        const question = quiz.questions.id(req.params.questionsId);

//         quiz.questions.pull({_id:req.params.questionsId});
//         await quiz.save();

//         return res.status(200).json(new ApiResponse(true,quiz,"question deleted sucessfully"));
//     }catch(error)
//     {
//         return res.status(500).json(new ApiResponse(false,null,error.message || "internale server error")) 
//     }
// }


export async function deleteQuestion(req, res, next) {
    try {
        const quiz = await quizModel.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json(
                new ApiResponse(false, null, "Quiz not found")
            );
        }

        const question = quiz.questions.id(req.params.questionId);

        if (!question) {
            return res.status(404).json(
                new ApiResponse(false, null, "Question not found")
            );
        }

        quiz.questions.pull({ _id: req.params.questionId });

        await quiz.save();

        return res.status(200).json(
            new ApiResponse(true, quiz, "Question deleted successfully")
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(false, null, error.message || "Internal server error")
        );
    }
}
