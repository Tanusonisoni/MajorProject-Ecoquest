
import { model, Schema } from "mongoose";

const challengeSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        lessonId: {
            type: Schema.Types.ObjectId,
            ref: "Lesson",
            required: true
        },
        instructions: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft"
        },
        marks: {
            type: Number,
            default: 0
        },
        feedback: {
            type: String,
            default: ""
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },
    { timestamps: true }
);

const challengeModel = model(
    "Challenge",
    challengeSchema
);

export default challengeModel;
