import  cartModel  from '../models/cart.model.js'

export default class CartManagerDB {
    async findAll() {
        const response = await cartModel.find();
        return response;
    }

    async findById(id) {
        const response = await cartModel.findById(id);
        return response;
    }
    async createOne(obj) {

        const response = await cartModel.create(obj);
        return response;
    }

    async deleteOne() {
        const response = await cartModel.findByIdAndDelete({ id });
        return response;
    }

    async insertProductInCart(idCart, idProduct) {


        try {
            const cart = await cartModel.findById(idCart);

            if (!cart) {
                throw new Error('Carrito no encontrado')
            }

            const product = cart.products.find(
                (product) => product.productId === idProduct
            )

            if (product) {
                product.quantity++;
                cart.products = [...cart.products, ...[product]];
            } else {
                cart.products = [
                    ...cart.products,
                    ...[{ productId: idProduct, quantity: 1 }],
                ];
            }

            await cart.save();

            return "Producto añadido."

        } catch (error) {
            throw error;
        }
    }

}

