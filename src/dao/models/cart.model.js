import mongoose, { Schema, model } from "mongoose";

//schema
const cartsSchema = new Schema(
  {
    products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: Number
        }
      ],
    });

const cartModel = model('Carts', cartsSchema);


export default cartModel;