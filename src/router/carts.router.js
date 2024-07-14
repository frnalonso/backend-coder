import {Router} from 'express'
import cartController from '../controllers/cart.controller.js';

const router = Router();

//Crea un nuevo carrito.
router.post('/', cartController.createCart)

//Inserta productos al carrito.
router.post('/:cid/product/:pid', cartController.insertProductInCart)

//Busca un único carrito según su id.
router.get('/:cid', cartController.getCartById)

//Busca todos los carritos.
router.get('/', cartController.getCartAll)

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/product/:pid', cartController.deleteProductCart)

//Actualiza el carrito con un arreglo de productos.
router.put('/:cid', cartController.updateCartArrayProducts)

//Actualizar SOLO la cantidad de ejemplares del producto.
router.put('/:cid/products/:pid', cartController.updateQuantityProductInCart)

//Se eliminan todos los productos del carrito.
router.delete('/:cid', cartController.deleteAllProductsInCart)

export default router;