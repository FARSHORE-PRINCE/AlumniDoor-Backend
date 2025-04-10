import mongoose, {Schema} from "mongoose";

const mentorSchema = new Schema(
    {
        mentor:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        hasAvailability:{
            type: Boolean,
            default:false
        },
        skillTags: {
            type: String,
            required: true,
        },
        totalStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Student"
            }
        ]
    }, 
    {
        timestamps: true
    }
);

export const Mentor = mongoose.model('Mentor', mentorSchema);