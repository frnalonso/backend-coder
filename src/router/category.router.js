import { Router } from 'express'
import categoryController from '../controllers/category.controller.js'

const router = Router();

//Obtengo todas las categorias
router.get('/categories', categoryController.getAll);

//Busco una categoría por ID
router.get('/category/:id', categoryController.getById)

//Creo una nueva categoría
router.post("/", categoryController.createCategory);

//Modifo una categoría según su ID
router.put("/category:id", categoryController.updateCategory);

router.delete("/category/:id", categoryController.deleteCategory);

export default router;