import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        index: true
    },
    description: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Referencia al modelo Category
        ref: "category", //referencia al nombre del modelo "category"
        require: true, //obligatorio tener una categoría asociada
    },
    thumbnail: {
        type: Buffer,
        require: false,
    },
    code: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        required: true,
        default:true

    }

})

productSchema.plugin(mongoosePaginate)




const productModel = mongoose.model("Product",productSchema)


export default productModel;

