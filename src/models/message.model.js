import mongoose, {Schema} from "mongoose";

const messageSchema = new Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        receiver:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        content:{
            type: String,
            required:true,
        },
        seen:{
            type: Boolean,
            default: false
        }
    }, 
    {
        timestamps: true
    }
);

export const Message = mongoose.model('Message', messageSchema);