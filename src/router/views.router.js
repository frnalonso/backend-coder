import {Router} from 'express'
import ProductManager from '../dao/db/productManager.js'


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


export default router;