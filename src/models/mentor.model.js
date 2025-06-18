import mongoose, {Schema} from "mongoose";

const mentorSchema = new Schema(
    {
        mentor:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
            },
        isAvailableForMentoring: {
            type: Boolean,
            default: false,
        },
        skillTags: {
            type: [String],
            required: true,
            trim: true,
        },
        currentProfession: {
            type: String,
            required: true,
        },
        mentees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",// Must be a user with role: "STUDENT"
            //totalStudents
        },
        ],
    }, 
    {
        timestamps: true
    }
);

export const Mentor = mongoose.model('Mentor', mentorSchema);