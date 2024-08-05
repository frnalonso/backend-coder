import cartRepository from '../repositories/cart.repository.js';
import productModel from '../models/product.model.js'; //arreglar y corregir no usar model aca
import productRepository from '../repositories/product.repository.js';
import ticketRepository from '../repositories/ticket.repository.js';


class CartService {

    constructor() {
        console.log("Servicio de Carrito")
    };
    async findAll() {
        const response = await cartRepository.findAll();
        return response;
    };

    async findById(id) {
        const response = await cartRepository.findById(id)
        return response;
    };

    async findByIdWithProducts(id) {
        const response = await cartRepository.findByIdWithProducts(id);
        return response;
    }
    async createOne() {
        const response = await cartRepository.createOne({});
        return response;
    };

    async deleteOne() {
        const response = await cartRepository.deleteOne(); //revisar este metodo
        return response;
    };

    // Método para eliminar varios productos del carrito
    async removeProductsFromCart(cid, productIds) {
        const cart = await cartRepository.findById(cid);
        if (!cart) {
            throw new Error("Carrito no encontrado. Por favor revise que exista el carrito.");
        }

        // Filtrar los productos que no están en la lista de IDs a eliminar
        cart.products = cart.products.filter(item => !productIds.includes(item.product.toString()));
        console.log(cart.products)

        await cartRepository.updateCartArrayProducts(cid, cart);
    }
    async updateCartArrayProducts(idCart, ArrayProducts) {
        const cart = await cartRepository.findById(idCart);
        if (!cart) {
            throw new Error("Carrito no encontrado.");
        }

        // Verificar si ArrayProducts es un array
        if (!Array.isArray(ArrayProducts)) {
            throw new TypeError("El argumento ArrayProducts no es un array.");
        }

        const addProducts = ArrayProducts;

        for (const newProduct of addProducts) {
            // Convertir ambos a string para comparar correctamente
            const productIndex = cart.products.findIndex(
                (product) => product.product._id.toString() === newProduct.product.toString()
            );

            if (productIndex !== -1) {
                // Actualizar la cantidad si el producto ya está en el carrito
                cart.products[productIndex].quantity += newProduct.quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({
                    product: newProduct.product,
                    quantity: newProduct.quantity,
                });
            }
        }

        await cart.save();
        return "Carrito actualizado.";
    }



    async updateQuantityProductInCart(idCart, idProduct, quantity) {
        try {

            const cart = await cartModel.findById(idCart)

            if (!cart) {
                throw new Error("Carrito no encontrado.")
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === idProduct);
            console.log(productIndex)
            if (productIndex !== -1) {
                console.log(cart.products[productIndex].quantity)
                console.log(Number(quantity))

                cart.products[productIndex].quantity += Number(quantity)
            } else {
                console.log("No existe el producto.")
            }

            await cart.save();
            return "Cantidad sumada correctamente."

        } catch (error) {
            console.log("Error al actualizar la cantidad ", error)
            throw error;
        }
    }

    async insertProductInCart(cid, idProduct, userId) {
        const cart = cartRepository.insertProductInCart(cid, idProduct, userId)
        return cart;
    };

    async deleteAllProductsInCart(cid) {
        try {
            const cart = await cartRepository.findById(cid);
            if (!cart) {
                throw new Error("El carrito no existe.");
            }
            cart.products = [];
            return await cart.save();
        } catch (error) {
            throw error;
        }
    }

    async purchaseCart(cid, userEmail) {
        let totalAmount = 0;
        const purchasedProducts = [];
        const failedProducts = []; // Para los productos que no pudieron comprarse

        const cart = await cartRepository.findById(cid);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        for (const item of cart.products) {
            const product = await productRepository.findById(item.product._id);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();

                totalAmount += product.price * item.quantity;
                purchasedProducts.push(item);
                console.log("entrepurchased")
            } else {
                console.log("entrefailed")
                // Producto no pudo ser comprado por falta de stock suficiente
                failedProducts.push(item);
            }
        }

        if (purchasedProducts.length === 0) {
            throw new Error('No hay productos con stock suficiente para completar la compra');
        }

        // Crear el ticket
        const ticketData = {
            code: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            amount: totalAmount,
            purchaser: userEmail
        };

        const newTicket = await ticketRepository.createOne(ticketData);
        await newTicket.save();

        // Vaciar el carrito solo de los productos que se han comprado
        await this.removeProductsFromCart(cid, purchasedProducts.map(item => item.product._id));
        console.log(failedProducts)

        // Dejar en el carrito los productos que no se pudieron comprar
        if (failedProducts.length > 0) {
            console.log("holaaa")
            console.log(failedProducts.length)
            await this.updateCartArrayProducts(cid, failedProducts);
        }

        return {
            ticket: newTicket,
            failedProducts: failedProducts.map(item => item.product._id)
        };
    }


}

export default new CartService();