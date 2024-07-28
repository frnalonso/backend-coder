import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import { entorno } from './config/config.js'
import __dirname from './utils.js'
import productsRouter from './router/products.router.js'
import cartsRouter from './router/carts.router.js'
import viewsRouter  from './router/views.router.js'
import sessionRouter from './router/sessions.router.js'
import usersRouter from './router/users.router.js'
import categoryRouter from  './router/category.router.js'
import productService from './dao/services/product.service.js'
import MessageManager from './dao/services/message.service.js'
import './dao/db/config.js'
import path from 'path'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import passport from 'passport'
import initilizePassport from './config/passport.config.js'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

const messageManager = new MessageManager()

//Variables de Entorno
const URI = entorno.mongoUrl
const port = entorno.port;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Conexión a la base de datos establecida");
  })
  .catch((error) => {
    console.error("Error en la conexión a la base de datos:", error);
  });


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname+'/public'))


//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, 'public')));

//logica de la sesión
app.use(session({
    store: new MongoStore({
        mongoUrl: URI,
        ttl: 3600
    }),
    secret:"Secret",
    resave: false,
    saveUninitialized: false 
}))

app.use(cookieParser())
initilizePassport()
app.use(passport.initialize())
app.use(passport.session())

//routes
app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/views',viewsRouter)
app.use("/api/sessions",sessionRouter) //no se utilizará ya que es como /api/users
app.use("/api/category", categoryRouter)
app.use("/api/users", usersRouter)

//twilio

const client = twilio(process.env.TWILIO_SSID, process.env.AUTH_TOKEN)

//sms
app.post('/api/sms', async(req,res) =>{
    const message = req.body
    const result = await client.messages.create({
        body: message,
        to:process.env.PHONE_NUMBER_TO, //cliente
        from: process.env.PHONE_NUMBER  //numero de twilio
    });

    res.send("Mensaje enviado.")
});

//nodemailer

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    secure: false,
    port:587,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    }
});

app.get('/', async (req, res) =>{
    res.send("Inicio")
});

app.get('/api/mail', async(req, res) => {
     await transport.sendMail({
        from: `Correo de prueba <${process.env.MAIL_USERNAME}>`,
        to: `${process.env.MAIL_USERNAME}`,
        subject: "Correo de prueba",
        html: `<div>
        <h2>CORREO</h2>
        <p>Hola mundo</p>
        </div>`,
    });
    res.send("Correo enviado")
});


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
        const product = await productService.createOne(data);
        socket.emit('server:newproduct', product);
    });

    socket.on('client:deleteproduct', async (productId) => {
        await productService.deleteOne(productId);
        socket.emit('server:deleteproduct', productId);
    });
});


