import productRepository from '../repositories/product.repository.js'

class ProductService {

    constructor() {
        console.log("Servicio de Producto")
    }
    //Obtengo productos
    async findAll(params) {
        const response = await productRepository.findAll(params)
        return response;
    }

    async findById(id) {
        const response = await productRepository.findById(id);
        return response;
    }
    async createOne(obj) {
        // Validación de negocio, por ejemplo, verificar si ya existe un producto con el mismo código.
        //const existingProduct = await productRepository.findByCode(obj.code);
        //if (existingProduct) {
           // throw new Error('Producto con el mismo código ya existe');
        //}
        return await productRepository.createOne(obj);
    }

    async updateOne(id, obj) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }
        return await productRepository.updateOne(id, obj);
    }

    async deleteOne(id) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }
        return await productRepository.deleteOne(id);
    }

    //buscar con categorias incluidas
    getAllProductsWithCategories = async () => {
        //lógica a implementar
        const products = await productRepository.getAllProductsWithCategories()
        return products;
    };

};

export default new ProductService;