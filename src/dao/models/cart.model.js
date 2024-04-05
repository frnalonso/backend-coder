import { Schema, model } from "mongoose";

//schema
const cartsSchema = new Schema(
    {
      products: {
        type: [{ productId: String, quantity: Number }],
        require: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

const cartModel = model('Carts', cartsSchema);


export default cartModel;