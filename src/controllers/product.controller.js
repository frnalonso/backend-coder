import productService from '../dao/services/product.service.js'

class ProductController {
    constructor() {
        console.log("Controlador de Producto")
    }
    //Obtengo productos
    async getAll (req, res) {
        try {
            // Obtener parámetros de consulta
            const products = await productService.findAll(req.query)

            if (!products) {
                res.status(200).json({ message: 'No existen productos actualmente.' })
            } else {
                res.status(200).json({ message: 'Productos encontrados: ', products })
                // console.log(page,limit,sort)
            }
        } catch (error) {
            res.status(500).json({ message: error })
            console.log(error)
        }
    }

    //Obtengo productos con su categoría
    async getAllProductsWithCategories (req, res) {
        try {
            // Obtener parámetros de consulta
            const products = await productService.getAllProductsWithCategories(req.query);
            if (!products) {
                res.status(200).json({ message: 'No existen productos actualmente.' })
            } else {
                res.status(200).json({ message: 'Productos con sus categorías: ', products })
                // console.log(page,limit,sort)
            }
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    async productFindById(req, res) {
        try {
            const { pid } = req.params
            const product = await productService.findById(pid)
            if (!product) {
                res.status(400).json({ message: 'Productos no encontrado con el id ingresado' })
                console.log("producto no encontrado")
            } else {
                res.status(200).json({ message: 'Producto encontrado: ', product })
                console.log("producto encontrado")
            }
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    async createProduct (req, res){
        try {
            //const { product } = req.body
            const newProduct = await productManager.createOne(req.body)
            res.status(200).json({ message: 'Producto agregado satisfactoriamente...', product: newProduct })
        } catch (error) {
            res.status(400).json({ message: error })
        }
    }

    async updateProduct (req, res) {
        const { pid } = req.params
        try {
            const response = await productService.updateOne(+pid, req.body)
            if (response === -1) {
                res.status(400).json({ message: 'Producto no encontrado con el id ingresado' })
            } else {
                await productService.updatOne(+pid);
                res.status(200).json({ message: 'Producto modificado satisfactoriamente...' })
            }

        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

    async deleteProduct (req, res) {
        const { pid } = req.params
        try {
            await productService.deleteOne(pid)
            res.status(200).json({ message: 'Producto eliminado correctamente...' })
        } catch (error) {
            res.status(500).json({ message: error })
        }
    }

};

export default new ProductController;