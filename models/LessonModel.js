
import { Schema, model } from 'mongoose';

const lessonSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    topic: {
      type: String,
      required: true,
      enum: [
        "Water Conservation",
        "Waste Management",
        "Climate Change",
        "Pollution",
        "Sustainability",
      ],
    },

    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

   createdBy:{
    type: Schema.Types.ObjectId,
     ref:"user"
   },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = model("Lesson", lessonSchema);

export default Lesson;
