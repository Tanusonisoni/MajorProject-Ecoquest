
import { Schema, model } from "mongoose";

const quizResultSchema = new Schema({
  quizId: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
    required: true
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    selectedAnswer: {
      type: String,
      required: true
    },
    isCorrect: {
      type: Boolean,
      required: true
    }
  }],
  score: {
    type: Number,
    required: true,
    min: 0
  },
  totalMarks: {
    type: Number,
    required: true,
    default: 50
  }
}, { timestamps: true });

quizResultSchema.index(
    { quizId: 1, studentId: 1 },
    { unique: true }
);

const quizResultModel =
 model.QuizResult || model("QuizResult", quizResultSchema);

export default quizResultModel;
