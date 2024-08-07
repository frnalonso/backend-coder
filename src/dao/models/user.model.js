import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    password: String,

    cart:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    },

    role: {
        type: String,
        enum: ["user", "admin", "premium"],
        default: "user"
    },

    documents: [{
        name: {
            type: String,
            required: true,
        },
        reference: {
            type: String,
            required: true,
        }
    }],
    
    last_connection: {
        type: Date,
      },

});

const User = mongoose.model("User", userSchema);

export default User;