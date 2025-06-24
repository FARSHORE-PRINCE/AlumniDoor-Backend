import mongoose, {Schema} from "mongoose";

const alumniSchema = new Schema(
    {
        alumni: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        totalContribution: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Transaction"
        },
        linkedInUrl: {
        type: String,
        required: true,
        trim: true,
        },
        currentProfession: {
        type: String,
        required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Alumni = mongoose.model("Alumni", alumniSchema);