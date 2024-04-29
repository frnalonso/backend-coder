import express from 'express'
import handlebars from 'express-handlebars'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter  from './router/views.router.js'
import { Server } from 'socket.io'
import __dirname from './utils.js'
import ProductManager from './dao/services/productManager.js'
import MessageManager from './dao/services/messageManager.js'
import './dao/db/config.js'
import path from 'path'

const productManager = new ProductManager()
const messageManager = new MessageManager()

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


const port = 8000;
const httpServer = app.listen(port,()=>{
    console.log("Escuchando puerto",port)
   })


 //websocket - server del lado del servidor
const socketServer = new Server(httpServer); // Establece el servidor de WebSocket

// Websocket para el Chat
socketServer.on('connection', (socket) => {
    console.log('Cliente conectado', socket.id);

   
    // Función para manejar los mensajes del chat
    async function messagesHandler() {
        socket.on("messageSent", async (message) => {
            await messageManager.createOne(message);
            emitNewMessages();
        });

        socket.on("getMessages", async () => {
            emitNewMessages();
        });
    }

    // Función para emitir nuevos mensajes a todos los clientes conectados
    async function emitNewMessages() {
        const messages = await messageManager.findAll();
        socketServer.emit("newMessages", messages);
    }

    // Llama a la función de manejo de mensajes del chat
    messagesHandler();

    // Función para manejar la creación y eliminación de productos
    socket.on('client:newproduct', async (data) => {
        const product = await productManager.createOne(data);
        socket.emit('server:newproduct', product);
    });

    socket.on('client:deleteproduct', async (productId) => {
        await productManager.deleteOne(productId);
        socket.emit('server:deleteproduct', productId);
    });
});


