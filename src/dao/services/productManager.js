
import productModel from '../models/product.model.js'

export default class ProductManagerDB {

  
    async findAll(params){

        const {
            limit = 4, // default limit = 10
            page = 1, // default page = 1
            sort = null,
            query = null,
            category = null,
            status = null, // disponible
          } = params;
      
          
          const options = {
            query: query,
            page: Number(page),
            limit: Number(limit),
            sort: sort ? { price: sort === "asc" ? 1 : -1 }: {},
            lean: true
          };

          const filtroConsulta = {}

            if (category) {
                filtroConsulta.category = { $regex: category, $options: "i" };
              }

            if (status) {
                filtroConsulta.status = status === "true"
              }

              console.log(filtroConsulta)
          


        const response = await productModel.paginate(filtroConsulta,options)
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