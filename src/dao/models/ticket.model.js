import mongoose from "mongoose";


const ticketSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        purchaser: {
            type: String,
            required: true,
        },
    },
    
    { timestamps: { purchase_datetime: "created_at" } }
);

const ticketModel = mongoose.model("Tickets", ticketSchema);

export default ticketModel;