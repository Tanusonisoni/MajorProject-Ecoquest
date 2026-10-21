import {Schema,model} from 'mongoose';

const questionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (options) => options.length >= 2,
      message: "At least 2 options are required"
    }
  },
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 10,
    min: 0
  }
});

const quizSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  lessonId: {
    type: Schema.Types.ObjectId,
    ref: "Lesson",
    required: true
  },
  questions: {
    type: [questionSchema],
    required: true,
    validate: {
      validator: (questions) => questions.length > 0,
      message: "Quiz must contain at least one question"
    }
  },
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft"
  }
}, { timestamps: true });

const Quiz = model("Quiz", quizSchema);

export default Quiz;