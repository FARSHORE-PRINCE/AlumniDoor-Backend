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
        linkedIn: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Alumni = mongoose.model("Alumni", alumniSchema);