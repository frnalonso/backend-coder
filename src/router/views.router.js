import {Router} from 'express'
import productService from '../dao/services/product.service.js'
import cartService from '../dao/services/cart.service.js';
import userService from '../dao/services/user.service.js';
import  passport  from 'passport';

const router = Router();



router.get('/products', passport.authenticate('jwt', {session:false}) , async (req, res) => {
    

    // Accede a la información de la sesión
   const userSession = req.session.user.user;
   console.log(userSession)
   const user = await userService.getById(userSession._id) // El usuario autenticado
   //console.log(user)
   let cartId = user.cart; // Obtén el ID del carrito del usuario

    // Si el usuario no tiene un carrito, crea uno nuevo
    if (!cartId) {
        const newCart = await cartService.createOne({ products: [] }); // Crea un carrito vacío
        cartId = newCart._id;

        // Actualiza el carrito del usuario en la base de datos
        await userService.updateUser(user._id, { cart: cartId });

        user.cart = cartId
    }
 
    const currentPage = req.query.page || 1;

    
    const queryParams = new URLSearchParams(req.query);
    queryParams.delete('page'); // Eliminar el parámetro "page" actual

    const products = await productService.findAll(req.query);

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
    { Products: products.docs, paginationInfo,cartId , user: req.session.user.user  });
});


router.get('/realtimeproducts',async(req,res)=>{

    const products = await productService.findAll(req.query)
    console.log({Products: products.docs})
    res.render('realTimeProducts', {Products: products.docs})
})


router.get('/chat', (req,res) => {
    res.render('chat')
});

router.get('/carts/:cid', async(req,res)=>{
    try {
        const {cid} = req.params
    const cart = await cartService.findById(cid) 
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