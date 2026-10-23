
import {model,Schema} from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student"
    },

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active"
    }
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

export default userModel;
