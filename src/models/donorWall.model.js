import mongoose, {Schema} from "mongoose";

const donationSchema = new Schema(
    {
        transactionDetail:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        },
        totalAmount:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Transaction"
        },

    },
    {
        timestamps: true
    }
);

export const Donation = mongoose.model("Donation", donationSchema); 