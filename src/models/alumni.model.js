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
        trim: true,
        },
        currentProfession: {
        type: String,
        }
    },
    {
        timestamps: true
    }
);

export const Alumni = mongoose.model("Alumni", alumniSchema);