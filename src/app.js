import express from 'express'
import {engine} from 'express-handlebars'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter  from './router/views.router.js'
import {Namespace, Server} from 'socket.io'
import {__dirname} from './utils.js'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager("../Products.json")

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

//handlebars
app.engine('handlebars',engine());
app.set('views',__dirname+'/views');
app.set("view engine", "handlebars");

//routes
app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/views',viewsRouter)


const port = 8080;
const httpServer = app.listen(port,()=>{
    console.log("Escuchando puerto",port)
   })


//websocket - server del lado del servidor
const socketServer = new Server(httpServer); //haciendo esto ya me deja a mi trabajar todo el tema de socket del lado del servidor


socketServer.on('connection',(socket)=>{

    let idCliente = socket.id
    
    console.log('Cliente conectado',idCliente);

   
    socket.on('client:newproduct',async (data)=>{
     const product =  await productManager.addProduct(data);
     console.log(product)
       socket.emit('server:newproduct',product)
    })



    socket.on('client:deleteproduct',async(productId)=>{
        console.log(productId)
        await productManager.deleteProduct(+productId);
        const product = await productManagerInstance.getProducts();
        console.log(product)
        socket.emit('server:deleteproduct',product)
    })
});


