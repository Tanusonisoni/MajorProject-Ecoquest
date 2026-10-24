import { model, Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    message: {
      type: String,
      required: true,
      trim: true
    },

    type: {
      type: String,
      enum: [
        "challenge_review",
        "quiz_result",
        "general"
      ],
      default: "general"
    },

    isRead: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const notificationModel = model(
  "notification",
  notificationSchema
);

export default notificationModel;