import {Router} from 'express'
import {productManager} from '../ProductManager.js'

const router = Router();

router.get('/', async(req,res)=>{
    try {
        const products = await productManager.getProducts()
        if (!products.length) {
            console.log(products)
            res.status(200).json({message: 'No existen productos actualmente.'})
        } else {
            res.status(200).json({message: 'Productos encontrados: ',products})
        }
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/:pid',async(req,res)=>{
    try {
        const {pid} = req.params
        const product = await productManager.getProdctById(+pid);
        if (!product) {
            res.status(400).json({message: 'Productos no encontrado con el id ingresado'})
            console.log("producto no encontrado")
        } else {
            res.status(200).json({message: 'Producto encontrado: ', product})
            console.log("producto encontrado")
        }
    } catch (error) {
        res.status(500).json({message:error})
    }
})

router.post('/', async(req,res)=>{
    try {
        console.log(req.body)
       const newProduct = await productManager.addProduct(req.body);
        res.status(200).json({message: 'Producto agregado satisfactoriamente...', product: newProduct })
    } catch (error) {
        res.status(400).json({message:error})
    }
})

router.put('/:pid', async(req,res)=>{
    const {pid} = req.params
   
    try {
        const response = await productManager.updateProduct(+pid,req.body)

        if (response === -1) {
            res.status(400).json({message: 'Producto no encontrado con el id ingresado'})
        } else {
            
            await productManager.updateProduct(+pid);
            res.status(200).json({message: 'Producto modificado satisfactoriamente...'})
        }

    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.delete('/:pid',async(req,res)=> {
const {pid} = req.params
    try {
        await productManager.deleteProduct(+pid)
        res.status(200).json({message: 'Producto eliminado correctamente...'})
    } catch (error) {
        res.status(500).json({message: error})
    }
})



export default router;