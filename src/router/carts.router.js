import {Router} from 'express'
//import CartManager from '../dao/FileSystem/CartManager.js'
import CartManagerDB from '../dao/services/cartManager.js';


const router = Router();
const cartManager = new CartManagerDB();


//Crea un nuevo carrito.
router.post('/', async(req,res)=> {
    try {
        
        const newCart = await cartManager.createOne()
        res.status(200).json({message: 'Carrito creado: ',cart: newCart})
    } catch (error) {
        res.status(400).json({message:error})
    }
})

//Inserta productos al carrito.
router.post('/:cid/product/:pid', async(req,res)=> {
    try {
        const {pid, cid} = req.params

        const cart = await cartManager.insertProductInCart(cid,pid);

        res.status(200).json({message: 'Producto agregado al carrito...', cart})

    } catch (error) {
        res.status(400).json({message:error})
    }
})

//Busca un único carrito según su id.
router.get('/:cid',async(req,res)=>{
    try {
        const {cid} = req.params
        const cartId = await cartManager.findById(cid)
        res.status(200).json({message: 'Carrito encontrado: ',cart : cartId})
    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Busca todos los carritos.
router.get('/',async(req,res)=>{
    try {
        const carts = await cartManager.findAll()
        res.status(200).json({message:"Carritos encontrados: ",cart: carts})
    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Eliminar del carrito el producto seleccionado
router.delete('/:cid/product/:pid', async(req,res)=> {

    const {cid, pid} = req.params
    try {
        console.log(cid,pid)
        await cartManager.removeProductCart(cid,pid)
        res.status(200).json({message:"Producto eliminado del carrito:  "})

    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Actualiza el carrito con un arreglo de productos.
router.put('/:cid', async(req,res)=> {

    const { cid } =req.params;
    const products = req.body;
    console.log(products)

    try {
        await cartManager.updateCartArrayProducts(cid,products)
        res.status(200).json({message: "Se actualizo el arreglo de productos del carrito."})
        
    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Actualizar SOLO la cantidad de ejemplares del producto.
router.put('/:cid/products/:pid', async(req,res)=>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    console.log(quantity)
    try {
        await cartManager.updateQuantityProductInCart(cid,pid,quantity)
        res.status(200).json({message: "Se actualizo la cantidad correctamente."})

    } catch (error) {
        res.status(400).json({message: error})
    }
})

//Se eliminan todos los productos del carrito.
router.delete('/:cid',async(req,res)=>{
    const {cid} = req.params
    
    try {
        await cartManager.deleteAllProductsInCart(cid) 
        res.status(200).json({message: "Se han eliminado todos los productos del carrito correctamente."})    
    } catch (error) {
        res.status(400).json({message: error})
    }
})

export default router;