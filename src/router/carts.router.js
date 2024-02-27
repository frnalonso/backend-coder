import {Router} from 'express'
import {cartManager} from '../CartManager.js'

const router = Router();

router.post('/', async(req,res)=> {
    try {
        console.log(req.body)
        const newCart = await cartManager.createCart();
        res.status(200).json({message: 'Carrito creado: ',cart: newCart})
    } catch (error) {
        res.status(400).json({message:error})
    }
})

router.post('/:cid/product/:pid', async(req,res)=> {
    try {
        const {pid, cid} = req.params

        const cart = await cartManager.insertProductInCart(cid,pid);

        res.status(200).json({message: 'Producto agregado al carrito...', cart})

    } catch (error) {
        res.status(400).json({message:error})
    }
})


router.get('/:cid',async(req,res)=>{
    try {
        const {cid} = req.params
        const cartId = await cartManager.getCartById(+cid)
        res.status(200).json({message: 'Carrito encontrado: ',cart : cartId})
    } catch (error) {
        res.status(400).json({message: error})
    }
})

router.get('/',async(req,res)=>{
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json({message:"Carritos encontrados: ",cart: carts})
    } catch (error) {
        res.status(400).json({message: error})
    }
})


export default router;