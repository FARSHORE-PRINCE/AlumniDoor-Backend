import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user document with role: "STUDENT"
      unique: true,
    },
    mentors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" //Each ObjectId should refer to a mentor document
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model("Student", studentSchema);
