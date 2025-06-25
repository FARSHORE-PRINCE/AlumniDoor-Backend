import mongoose, { Schema } from "mongoose";

const mentorSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Refers to a User with role: "MENTOR"
      unique: true,
    },

      students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"// "User" if you're storing students in User
      },
    ],

    skillTags: {
      type: [String],
      default: [], // always add default for array to avoid undefined issues
    },

    currentProfession: {
      type: String,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

export const Mentor = mongoose.model("Mentor", mentorSchema);
