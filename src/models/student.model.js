import mongoose, {Schema} from "mongoose";

const studentSchema = new Schema(
    {
        Student: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        totalMentor:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"Mentor"
            }
        ]
    }, 
    {
        timestamps: true
    }
);

export const Student = mongoose.model('Student', studentSchema);