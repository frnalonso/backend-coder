import cartRepository from '../repositories/cart.repository.js';
import productModel from '../models/product.model.js'; //arreglar y corregir no usar model aca
import productRepository from '../repositories/product.repository.js';
import ticketRepository from '../repositories/ticket.repository.js';


class CartService {

    constructor() {
        console.log("Servicio de Carrito")
    };
    async findAll() {
        const response = await cartModel.find();
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

    async removeProductCart(cid, pid) {
        // Buscar el carrito por su ID
        const cart = await cartRepository.findById(cid);
        if (!cart) {
            return console.log("Carrito no encontrado. Por favor revise que exista el carrito.")
        }

        const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
        console.log(productIndex)
        if (productIndex === -1) {
            return console.log("Producto no encontrado. Por favor revise que exista el producto.")
        }

        // Eliminar el producto del array
        cart.products.splice(productIndex, 1);

        return await cartRepository.updateCartArrayProducts(cid, cart)

    };

    async updateCartArrayProducts(idCart, ArrayProducts) {

        const cart = await cartRepository.findById(idCart)
        if (!cart) {
            throw new Error("Carrito no encontrado.")
        }

        const addProducts = ArrayProducts

        for (const newProduct of addProducts) {
            const productIndex = cart.products.findIndex((product) => product.product._id.toString() === newProduct.product)
            console.log(productIndex)
            if (productIndex !== -1) {
                console.log(cart.products[productIndex].quantity)
                console.log(newProduct.quantity)
                cart.products[productIndex].quantity += newProduct.quantity
            } else {
                console.log("id:" + newProduct.product)
                const product = await productModel.findById(newProduct.product);
                cart.products.push({
                    product: product,
                    quantity: newProduct.quantity,
                })
            }
        }
        await cart.save();
        return "Carrito actualizado."

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
        const cart = cartRepository.insertProductInCart(cid,idProduct,userId)
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

    async purchaseCart(cid,userEmail) {
            let totalAmount = 0;
            const purchasedProducts = [];

            const cart = await cartRepository.findById(cid)
    
            if (!cart) {
                throw new Error( 'Carrito no encontrado' );
            }

    
            for (const item of cart.products) {
                console.log(item)
                const product = await productRepository.findById(item.product._id);
    
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
    
                    totalAmount += product.price * item.quantity;
                    purchasedProducts.push(item);
                }
            } 
    

            if (purchasedProducts.length === 0) {
                throw new Error( 'No hay productos con stock suficiente para completar la compra');
            }

                    // Crear el ticket
        const ticketData = {
            code: `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            amount: totalAmount,
            purchaser: userEmail
        };
    
            const newTicket = await ticketRepository.createOne(ticketData);
    
            await newTicket.save();
    
            // Vaciar el carrito
            await this.deleteAllProductsInCart(cid);

    };

}

export default new CartService();