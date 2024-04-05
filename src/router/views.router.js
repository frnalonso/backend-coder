import {Router} from 'express'
import ProductManager from '../dao/services/productManager.js'


const router = Router();
const productManager = new ProductManager()

router.get('/index', async(req,res)=>{
    const products = await productManager.findAll();
    console.log(products)
   
    res.render('index',{Products: products} );
});

router.get('/realtimeproducts',async(req,res)=>{
    const products = await productManager.findAll()
    res.render('realTimeProducts', {Products: products})
})

router.get('/chat', (req,res) => {
    res.render('chat')
});


export default router;