import {model,Schema} from "mongoose";

const challengeSubmissionSchema = new Schema(
    {
        challengeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Challenge",
            required: true
        },

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        proofUrl: {
            type: String,
            required: true
        },

        proofType: {
            type: String,
            enum: ["image", "video"],
            required: true
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        feedback: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const challengeSubmissionModel = model(
    "ChallengeSubmission",
    challengeSubmissionSchema
);

export default challengeSubmissionModel;