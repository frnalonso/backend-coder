import {Router} from 'express'
import productController from '../controllers/product.controller.js'
import { isAdmin, authenticateJWT } from '../middlewares/auth.js'


const router = Router();
//const productManager = new ProductManager("../Products.json")

//Obtengo productos
router.get('/', productController.getAll)

//Obtengo productos con su categoría
router.get('/productscategory', productController.getAllProductsWithCategories)

//Obtengo producto por id
router.get('/:pid',productController.productFindById)

//Creo un nuevo producto
router.post('/',authenticateJWT,  isAdmin, productController.createProduct)

//Modifico un producto
router.put('/:pid',authenticateJWT, isAdmin, productController.updateProduct)

//Elimino un producto
router.delete('/:pid',authenticateJWT, isAdmin, productController.deleteProduct)



export default router;