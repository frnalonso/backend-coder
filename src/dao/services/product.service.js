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
    async createOne(productData, userRole, userId) {

        // Verifica si el código del producto ya existe
        const existingProduct = await productRepository.findOne({ code: productData.code });
        if (existingProduct) {
            throw new Error('El código del producto ya está en uso.');
        }

        // Si el usuario es premium, asignar su ID como owner, de lo contrario asignar "admin" (entiendo que premium y admin pueden crear asi que se asigna el id.)
        if (userRole === 'premium') {
            productData.owner = userId;
        } else {
            productData.owner = userId
        }

        // Llamar al repositorio para crear el producto
        return await productRepository.createOne(productData);
    };


    async updateOne(id, obj) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }
        return await productRepository.updateOne(id, obj);
    }

    async deleteOne(id, userRole, userId) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }
    
        // Verifica permisos de eliminación
        if (userRole === 'admin') {
            // Los administradores pueden eliminar cualquier producto
            return await productRepository.deleteOne(id);
        } else if (userRole === 'premium') {
            // Los usuarios premium solo pueden eliminar productos que les pertenecen
            if (existingProduct.owner.toString() === userId.toString()) {
                return await productRepository.deleteOne(id);
            } else {
                throw new Error('No tienes permiso para eliminar este producto.');
            }
        } else {
            throw new Error('Acceso denegado: No tienes permisos para eliminar productos.');
        }
    }
    

    //buscar con categorias incluidas
    getAllProductsWithCategories = async () => {
        //lógica a implementar
        const products = await productRepository.getAllProductsWithCategories()
        return products;
    };

};

export default new ProductService;