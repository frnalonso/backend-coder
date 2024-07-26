import cartService from '../dao/services/cart.service.js';


class CartController {

    constructor() {
        console.log("Controlador de Carritos")
    }
    //Crea un nuevo carrito.
    async createCart(req, res) {

        try {
            const newCart = await cartService.createOne()
            res.status(200).json({ message: 'Carrito creado: ', cart: newCart })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Inserta productos al carrito.
    async insertProductInCart (req, res) {
        try {
            const user = req.user._id; // Obtener el usuario autenticado
            const { cid } = req.params; // ID del carrito desde la ruta
            const { pid } = req.params; // ID del producto desde la ruta
            console.log(user)
            const cart = await cartService.insertProductInCart(cid, pid, user);
            res.status(200).json({ message: 'Producto agregado al carrito...', cart })

        } catch (error) {
            res.status(400).json({ message: error })
        }
    }


    //Busca un único carrito según su id.
    async getCartById (req, res) {
        try {
            const { cid } = req.params
            const cartId = await cartService.findById(cid)
            res.status(200).json({ message: 'Carrito encontrado: ', cart: cartId })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Busca todos los carritos.
    async getCartAll (req, res) {
        try {
            const carts = await cartService.findAll()
            res.status(200).json({ message: "Carritos encontrados: ", cart: carts })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: error })
        }
    }

    //Eliminar del carrito el producto seleccionado
    async deleteProductCart (req, res) {
        const { cid, pid } = req.params
        try {
            console.log(cid, pid)
            await cartService.removeProductCart(cid, pid)
            res.status(200).json({ message: "Producto eliminado del carrito:  " })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Actualiza el carrito con un arreglo de productos.
    async updateCartArrayProducts (req, res) {
        const { cid } = req.params;
        const products = req.body;
        try {
            await cartManager.updateCartArrayProducts(cid, products)
            res.status(200).json({ message: "Se actualizo el arreglo de productos del carrito." })

        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Actualizar SOLO la cantidad de ejemplares del producto.
    async updateQuantityProductInCart (req, res) {
        const { cid, pid } = req.params
        const { quantity } = req.body
        try {
            await cartManager.updateQuantityProductInCart(cid, pid, quantity)
            res.status(200).json({ message: "Se actualizo la cantidad correctamente." })

        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    //Se eliminan todos los productos del carrito.
    async deleteAllProductsInCart (req, res) {
        const { cid } = req.params

        try {
            await cartManager.deleteAllProductsInCart(cid)
            res.status(200).json({ message: "Se han eliminado todos los productos del carrito correctamente." })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

};

export default new CartController;