import mongoose from 'mongoose'
const { Schema } = mongoose
const collection = 'Messages'


const messageSchema = new Schema(

    {
        user: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
    },
      {
        timestamps: true,
        versionKey: false,
      }
);

const messageModel = mongoose.model(collection,messageSchema) 

export default messageModel;

