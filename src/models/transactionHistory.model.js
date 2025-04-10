import mongoose, {Schema} from "mongoose";

const transactionSchema = new Schema( 
    {
        donor:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        hasAnonymity: {
            type: Boolean,
            default: false
        },
        status:{
            type: String, 
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "FAILED", 
        },
        totalAmont:{
            type: Number,
            default: 0,
        }
    }, 
    {
        timestamps: true
    }
);

export const Transaction = mongoose.model("Transaction", transactionSchema)