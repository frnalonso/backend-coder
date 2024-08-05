import { Router } from 'express';
import cartController from '../controllers/cart.controller.js';
import { authenticateJWT } from '../middlewares/auth.js';
import { isUserOrPremium, isAdmin } from '../middlewares/auth.js';

const router = Router();

// Crear un nuevo carrito (acceso para todos los roles)
router.post('/', authenticateJWT, cartController.createCart);

// Insertar productos al carrito (solo usuarios y premium)
router.post('/:cid/product/:pid', authenticateJWT, isUserOrPremium, cartController.insertProductInCart);

// Buscar un carrito por ID (acceso para todos los roles)
router.get('/:cid', authenticateJWT, cartController.getCartByIdWithProducts);

// Obtener todos los carritos (solo admin)
router.get('/', authenticateJWT, isAdmin, cartController.getCartAll);

// Eliminar un producto del carrito (solo usuarios y premium)
router.delete('/:cid/product/:pid', authenticateJWT, isUserOrPremium, cartController.deleteProductCart);

// Actualizar el carrito con un arreglo de productos (solo usuarios y premium)
router.put('/:cid', authenticateJWT, isUserOrPremium, cartController.updateCartArrayProducts);

// Actualizar SOLO la cantidad de ejemplares del producto (solo usuarios y premium)
router.put('/:cid/products/:pid', authenticateJWT, isUserOrPremium, cartController.updateQuantityProductInCart);

// Eliminar todos los productos del carrito (solo usuarios y premium)
router.delete('/:cid', authenticateJWT, isUserOrPremium, cartController.deleteAllProductsInCart);

// Ruta para finalizar la compra de un carrito (solo usuarios y premium)
router.post('/:cid/purchase', authenticateJWT, isUserOrPremium, cartController.purchaseCart);

export default router;
