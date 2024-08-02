import productService from '../dao/services/product.service.js';
import errorDictionary from '../errors/errorTypes.js';
import { CustomError } from '../errors/customError.js';

class ProductController {
    constructor() {
        console.log("Controlador de Producto");
    }

    // Obtengo productos
    async getAll(req, res, next) {
        try {
            console.log("hola")
            const products = await productService.findAll(req.query);
            console.log(products)
            if (!products || products.length === 0) {
                res.status(200).json({ message: 'No existen productos actualmente.' });
            } else {
                res.status(200).json({ message: 'Productos encontrados: ', products });
            }
        } catch (error) {
            next(CustomError.createError({
                name: "ProductRetrievalError",
                message: errorDictionary.PRODUCT_RETRIEVAL_FAILED.message,
                code: errorDictionary.PRODUCT_RETRIEVAL_FAILED.statusCode,
                description: error.message
            }));
        }
    }
    

    // Obtengo productos con su categoría
    async getAllProductsWithCategories(req, res, next) {
        try {
            const products = await productService.getAllProductsWithCategories(req.query);
            if (!products || products.length === 0) {
                res.status(200).json({ message: 'No existen productos actualmente.' });
            } else {
                res.status(200).json({ message: 'Productos con sus categorías: ', products });
            }
        } catch (error) {
            next(CustomError.createError({
                name: "ProductRetrievalError",
                message: errorDictionary.PRODUCT_RETRIEVAL_FAILED.message,
                code: errorDictionary.PRODUCT_RETRIEVAL_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    async productFindById(req, res, next) {
        try {
            const { pid } = req.params;
            const product = await productService.findById(pid);
            if (!product) {
                throw CustomError.createError({
                    name: "ProductNotFoundError",
                    message: errorDictionary.PRODUCT_NOT_FOUND.message,
                    code: errorDictionary.PRODUCT_NOT_FOUND.statusCode,
                    description: `Product with ID ${pid} not found.`
                });
            } else {
                res.status(200).json({ message: 'Producto encontrado: ', product });
            }
        } catch (error) {
            next(error instanceof CustomError ? error : CustomError.createError({
                name: "ProductRetrievalError",
                message: errorDictionary.PRODUCT_RETRIEVAL_FAILED.message,
                code: errorDictionary.PRODUCT_RETRIEVAL_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    async createProduct(req, res, next) {
        try {
            const newProduct = await productService.createOne(req.body);
            res.status(200).json({ message: 'Producto agregado satisfactoriamente...', product: newProduct });
        } catch (error) {
            next(CustomError.createError({
                name: "ProductCreationError",
                message: errorDictionary.PRODUCT_CREATION_FAILED.message,
                code: errorDictionary.PRODUCT_CREATION_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    async updateProduct(req, res, next) {
        const { pid } = req.params;
        try {
            const response = await productService.updateOne(+pid, req.body);
            if (!response) {
                throw CustomError.createError({
                    name: "ProductNotFoundError",
                    message: errorDictionary.PRODUCT_NOT_FOUND.message,
                    code: errorDictionary.PRODUCT_NOT_FOUND.statusCode,
                    description: `Product with ID ${pid} not found for update.`
                });
            }
            res.status(200).json({ message: 'Producto modificado satisfactoriamente...' });
        } catch (error) {
            next(error instanceof CustomError ? error : CustomError.createError({
                name: "ProductUpdateError",
                message: errorDictionary.PRODUCT_UPDATE_FAILED.message,
                code: errorDictionary.PRODUCT_UPDATE_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    async deleteProduct(req, res, next) {
        const { pid } = req.params;
        try {
            const response = await productService.deleteOne(pid);
            if (!response) {
                throw CustomError.createError({
                    name: "ProductNotFoundError",
                    message: errorDictionary.PRODUCT_NOT_FOUND.message,
                    code: errorDictionary.PRODUCT_NOT_FOUND.statusCode,
                    description: `Product with ID ${pid} not found for deletion.`
                });
            }
            res.status(200).json({ message: 'Producto eliminado correctamente...' });
        } catch (error) {
            next(error instanceof CustomError ? error : CustomError.createError({
                name: "ProductDeletionError",
                message: errorDictionary.PRODUCT_DELETION_FAILED.message,
                code: errorDictionary.PRODUCT_DELETION_FAILED.statusCode,
                description: error.message
            }));
        }
    }
}

export default new ProductController();
