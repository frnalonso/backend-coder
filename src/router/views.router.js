import {Router} from 'express'
import ProductManager from '../dao/services/productManager.js'
import CartManagerDB from '../dao/services/cartManager.js';
import  passport  from 'passport';


const router = Router();
const productManager = new ProductManager()
const cartManager = new CartManagerDB()

router.get('/products', passport.authenticate('jwt', {session:false}) , async (req, res) => {
    console.log(req.query);
    const cartIdPorDefecto = '662d957cec28377647b1982f' //Se utiliza un cartIdPorDefecto dado que es la Segunda Pre Entrega. En la próxima será utilizado con la sesión usuario.
    const cart = await cartManager.findById(cartIdPorDefecto)
    const cartId = cart._id
    console.log(cartId)
    const currentPage = req.query.page || 1;

    
    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('page'); // Eliminar el parámetro "page" actual

    const products = await productManager.findAll(req.query);

    const paginationInfo = {
        hasNextPage: products.hasNextPage
            ? `http://localhost:8000/api/views/products?page=${products.nextPage}&${queryParams}`
            : "",
        hasPrevPage: products.hasPrevPage
            ? `http://localhost:8000/api/views/products?page=${products.prevPage}&${queryParams}`
            : "",
        nextPage: products.nextPage,
        prevPage: products.prevPage,
        totalPages: products.totalPages,
        currentPage: currentPage
    };

    console.log(paginationInfo.hasNextPage);

    res.render('products', 
    { Products: products.docs, paginationInfo, cartId, user: req.session.user });
});


router.get('/realtimeproducts',async(req,res)=>{

    const products = await productManager.findAll(req.query)
    console.log({Products: products.docs})
    res.render('realTimeProducts', {Products: products.docs})
})


router.get('/chat', (req,res) => {
    res.render('chat')
});

router.get('/carts/:cid', async(req,res)=>{
    try {
        const {cid} = req.params
    const cart = await cartManager.findById(cid) 
    res.render("cart", cart);
    } catch (error) {
        
    }
})

router.get('/register',(req,res) =>{
    res.render('register')
})
router.get('/login',(req,res) =>{
    res.render('login')
})

router.get('/restore', (req,res) =>{
    res.render('restore')
})

export default router;