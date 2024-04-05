import productModel from '../models/product.model.js'


export default class ProductManagerDB {

    constructor() {
        console.log('Clase productManager')
    }

    async findAll(){
        const response = await productModel.find().lean();
        return response;
    }

    async findById(id) {
        const response = await productModel.findById(id);
        return response;
    }
    async createOne(obj) {
        //Falta agregar metodo para que restringa en el caso que quiera agregar un objeto con el mismo codigo.
        const response = await productModel.create(obj);
        return response;
    }

    async updateOne(id,obj) {
        //Falta probar este metodo
        const response = await productModel.findByIdAndUpdate({_id: id},{$set: obj}).lean();
        return response;
    }

    async deleteOne(id) {
        //Falta agregar metodo que restringa en el caso que se envia un id y no exista.
        const response = await productModel.deleteOne({_id: id}).lean();
        return response;
    }

}