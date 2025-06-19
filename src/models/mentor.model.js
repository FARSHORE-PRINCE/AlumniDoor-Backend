import mongoose, { Schema } from "mongoose";

const mentorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to a User with role: "MENTOR"
      required: true,
      unique: true,
    },
    isAvailableForMentoring: {
      type: Boolean,
      default: false,
    },
    skillTags: {
      type: [String],
      required: true,
      default: [], // always add default for array to avoid undefined issues
      trim: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"//r "User" if you're storing students in User
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Mentor = mongoose.model("Mentor", mentorSchema);
