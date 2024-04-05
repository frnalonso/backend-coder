import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter  from './router/views.router.js'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductManager from './dao/db/productManager.js'
import './dao/db/config.js'
import path from 'path'



const productManager = new ProductManager()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

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


socketServer.on('connection',(socket)=> {

    let idCliente = socket.id
    
    console.log('Cliente conectado',idCliente);

   
    socket.on('client:newproduct',async (data)=>{
     const product =  await productManager.createOne(data)
       socket.emit('server:newproduct',product)

       
    })
    
    socket.on('client:deleteproduct',async(productId)=>{
     
     await productManager.deleteOne(productId)
     //const products = await productManager.findAll()
     socket.emit('server:deleteproduct',productId)
     

 })

 


});


