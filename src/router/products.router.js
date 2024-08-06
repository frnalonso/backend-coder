import {Router} from 'express'
import productController from '../controllers/product.controller.js'
import { isAdmin, authenticateJWT, isPremiumOrAdmin } from '../middlewares/auth.js'


const router = Router();
//const productManager = new ProductManager("../Products.json")

//Obtengo productos
router.get('/', productController.getAll)

//Obtengo productos con su categoría
router.get('/productscategory', productController.getAllProductsWithCategories)

//Obtengo producto por id
router.get('/:pid',productController.productFindById)

//Creo un nuevo producto
router.post('/',authenticateJWT,  isPremiumOrAdmin, productController.createProduct)

//Modifico un producto
router.put('/:pid',authenticateJWT, isPremiumOrAdmin, productController.updateProduct)

//Elimino un producto
router.delete('/:pid',authenticateJWT, isPremiumOrAdmin, productController.deleteProduct)



export default router;