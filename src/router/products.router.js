import {Router} from 'express'
//import ProductManager from '../dao/FileSystem/ProductManager.js'
import ProductManagerDB from '../dao/services/productManager.js'


const productManager = new ProductManagerDB();
const router = Router();
//const productManager = new ProductManager("../Products.json")

//get Products
router.get('/', async(req,res)=>{
    try {
          // Obtener parámetros de consulta
        
          const products = await productManager.getAll(req.query);
          if (!products) {
              res.status(200).json({message: 'No existen productos actualmente.'})
            } else {
                res.status(200).json({message: 'Productos encontrados: ',products})
               // console.log(page,limit,sort)
        }
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/productscategory', async(req,res)=>{
    try {
          // Obtener parámetros de consulta
        
          const products = await productManager.getAllProductsWithCategories(req.query);
          if (!products) {
              res.status(200).json({message: 'No existen productos actualmente.'})
            } else {
                res.status(200).json({message: 'Productos con sus categorías: ',products})
               // console.log(page,limit,sort)
        }
    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.get('/:pid',async(req,res)=>{
    try {
        const {pid} = req.params
        console.log(pid)
        const product = await productManager.findById(pid)
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
        //const { product } = req.body
       const newProduct = await productManager.createOne(req.body)
        res.status(200).json({message: 'Producto agregado satisfactoriamente...', product: newProduct })
    } catch (error) {
        res.status(400).json({message:error})
    }
})

router.put('/:pid', async(req,res)=>{
    const {pid} = req.params
   
    try {
        const response = await productManager.updateOne(+pid,req.body)

        if (response === -1) {
            res.status(400).json({message: 'Producto no encontrado con el id ingresado'})
        } else {
            
            await ProductManagerDB.updatOne(+pid);
            res.status(200).json({message: 'Producto modificado satisfactoriamente...'})
        }

    } catch (error) {
        res.status(500).json({message: error})
    }
})

router.delete('/:pid',async(req,res)=> {
const {pid} = req.params
    try {
        await productManager.deleteOne(pid)
        res.status(200).json({message: 'Producto eliminado correctamente...'})
    } catch (error) {
        res.status(500).json({message: error})
    }
})



export default router;