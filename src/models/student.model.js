import mongoose, {Schema} from "mongoose";

const studentSchema = new Schema(
    {
        Student: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            // required: true,
            // unique: true, // Each student should map to only one User
        },
        mentors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor", // Must be a user with role: "MENTOR"
            //totalMentor
        },
    ]
    }, 
    {
        timestamps: true
    }
);

export const Student = mongoose.model('Student', studentSchema);