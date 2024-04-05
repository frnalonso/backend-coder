import mongoose from 'mongoose'
const { Schema } = mongoose
const collection = 'Products'

const productSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    thumbnail: {
        type: Buffer
    },
    code: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        default: 0
    }
})

const productModel = mongoose.model(collection,productSchema)

export default productModel;