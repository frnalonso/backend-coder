import cartService from '../dao/services/cart.service.js';
import errorDictionary from '../errors/errorTypes.js';
import { CustomError } from '../errors/customError.js';

class CartController {
    constructor() {
        console.log("Controlador de Carritos");
    }

    // Crea un nuevo carrito
    async createCart(req, res, next) {
        try {
            const newCart = await cartService.createOne();
            res.status(200).json({ message: 'Carrito creado: ', cart: newCart });
        } catch (error) {
            next(CustomError.createError({
                name: "CartCreationError",
                message: errorDictionary.CART_CREATION_FAILED.message,
                code: errorDictionary.CART_CREATION_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Inserta productos al carrito
    async insertProductInCart(req, res, next) {
        try {
            const user = req.session.user.user._id;
            const { cid, pid } = req.params;
            const cart = await cartService.insertProductInCart(cid, pid, user);
            res.status(200).json({ message: 'Producto agregado al carrito...', cart });
        } catch (error) {
            next(CustomError.createError({
                name: "AddToCartError",
                message: errorDictionary.ADD_TO_CART_FAILED.message,
                code: errorDictionary.ADD_TO_CART_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Busca un único carrito según su id
    async getCartById(req, res, next) {
        try {
            const { cid } = req.params;
            const cartId = await cartService.findById(cid);
            if (!cartId) {
                throw CustomError.createError({
                    name: "CartNotFoundError",
                    message: errorDictionary.CART_NOT_FOUND.message,
                    code: errorDictionary.CART_NOT_FOUND.statusCode,
                    description: `Carrito con ID ${cid} no encontrado.`
                });
            }
            res.status(200).json({ message: 'Carrito encontrado: ', cart: cartId });
        } catch (error) {
            next(error);
        }
    }

    // Busca un carrito por id con productos
    async getCartByIdWithProducts(req, res, next) {
        try {
            const { cid } = req.params;
            const cartId = await cartService.findByIdWithProducts(cid);
            if (!cartId) {
                throw CustomError.createError({
                    name: "CartNotFoundError",
                    message: errorDictionary.CART_NOT_FOUND.message,
                    code: errorDictionary.CART_NOT_FOUND.statusCode,
                    description: `Carrito con ID ${cid} no encontrado.`
                });
            }
            res.status(200).json({ message: 'Carrito encontrado: ', cart: cartId });
        } catch (error) {
            next(error);
        }
    }

    // Busca todos los carritos
    async getCartAll(req, res, next) {
        try {
            const carts = await cartService.findAll();
            console.log(carts)
            res.status(200).json({ message: "Carritos encontrados: ", cart: carts });
        } catch (error) {
            req.logger.error("Error: ",error)
            next(CustomError.createError({
                name: "CartRetrievalError",
                message: errorDictionary.CART_NOT_FOUND.message,
                code: errorDictionary.CART_NOT_FOUND.statusCode,
                description: error.message
            }));
        }
    }

    // Eliminar del carrito el producto seleccionado
    async deleteProductCart(req, res, next) {
        const { cid, pid } = req.params;
        try {
            await cartService.removeProductCart(cid, pid);
            res.status(200).json({ message: "Producto eliminado del carrito: " });
        } catch (error) {
            next(CustomError.createError({
                name: "ProductRemovalError",
                message: errorDictionary.PRODUCT_DELETION_FAILED.message,
                code: errorDictionary.PRODUCT_DELETION_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Actualiza el carrito con un arreglo de productos
    async updateCartArrayProducts(req, res, next) {
        const { cid } = req.params;
        const products = req.body;
        try {
            await cartService.updateCartArrayProducts(cid, products);
            res.status(200).json({ message: "Se actualizo el arreglo de productos del carrito." });
        } catch (error) {
            console.log("asaoskaoksa")
            next(CustomError.createError({
                name: "CartUpdateError",
                message: errorDictionary.PRODUCT_UPDATE_FAILED.message,
                code: errorDictionary.PRODUCT_UPDATE_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Actualizar SOLO la cantidad de ejemplares del producto
    async updateQuantityProductInCart(req, res, next) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        try {
            await cartService.updateQuantityProductInCart(cid, pid, quantity);
            res.status(200).json({ message: "Se actualizo la cantidad correctamente." });
        } catch (error) {
            next(CustomError.createError({
                name: "QuantityUpdateError",
                message: errorDictionary.PRODUCT_UPDATE_FAILED.message,
                code: errorDictionary.PRODUCT_UPDATE_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Se eliminan todos los productos del carrito
    async deleteAllProductsInCart(req, res, next) {
        const { cid } = req.params;
        try {
            await cartService.deleteAllProductsInCart(cid);
            res.status(200).json({ message: "Se han eliminado todos los productos del carrito correctamente." });
        } catch (error) {
            next(CustomError.createError({
                name: "ProductRemovalError",
                message: errorDictionary.PRODUCT_DELETION_FAILED.message,
                code: errorDictionary.PRODUCT_DELETION_FAILED.statusCode,
                description: error.message
            }));
        }
    }

    // Realiza la compra del carrito
    async purchaseCart(req, res, next) {
        const { cid } = req.params;
        const userEmail = req.session.user.user.email;
        try {
            const ticket = await cartService.purchaseCart(cid, userEmail);
            res.status(200).json({ message: 'Compra realizada con éxito', ticket });
            
        } catch (error) {
            next(CustomError.createError({
                name: "PurchaseError",
                message: errorDictionary.PURCHASE_FAILED.message,
                code: errorDictionary.PURCHASE_FAILED.statusCode,
                description: error.message
            }));
        }
    }
}

export default new CartController();
