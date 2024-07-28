import {Router} from 'express'
import productService from '../dao/services/product.service.js'
import cartService from '../dao/services/cart.service.js';
import userService from '../dao/services/user.service.js';
import { auth } from '../middlewares/auth.js'

const router = Router();



router.get('/products', auth, async (req, res) => {
    

    // Accede a la información de la sesión
   const userSession = req.session.user.user;
   const user = await userService.getById(userSession._id) // El usuario autenticado
   //console.log(user)
   let cartId = user.cart; // Obtén el ID del carrito del usuario
    console.log(cartId)
    // Si el usuario no tiene un carrito, crea uno nuevo
    if (!cartId) {
        console.log("hola")
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


router.get('/realtimeproducts', auth, async(req,res)=>{

    const products = await productService.findAll(req.query)
    console.log({Products: products.docs})
    res.render('realTimeProducts', {Products: products.docs})
})


router.get('/chat', auth, (req,res) => {
    res.render('chat')
});

router.get('/carts/:cid',auth, async(req,res)=>{
    try {
        const {cid} = req.params
    
    const cart = await cartService.findByIdWithProducts(cid);
    
    console.log(cart._id)
    res.render("cart", {cart});
    } catch (error) {
        console.log(error)
    }
})

router.get('/register',(req,res) =>{
    res.render('register')
})
router.get('/login',(req,res) =>{
    res.render('login')
})

router.get('/restore',auth, (req,res) =>{
    res.render('restore')
})

export default router;