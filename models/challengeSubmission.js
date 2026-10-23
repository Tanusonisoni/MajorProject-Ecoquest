
import {Schema,model} from "mongoose";

const challengeSubmissionSchema = new Schema(
  {
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "challenge",
      required: true
    },

    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
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

    marks: {
      type: Number,
      default: 0,
      min: 0
    },

    feedback: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const ChallengeSubmission = model(
  "ChallengeSubmission",
  challengeSubmissionSchema
);

export default ChallengeSubmission;
