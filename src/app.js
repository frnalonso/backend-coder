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
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose';
import sessionRouter from './router/sessions.router.js'

const productManager = new ProductManager()
const messageManager = new MessageManager()


const URI = 'mongodb+srv://falonso:123@coderhouse-ecommerce.u3qivcn.mongodb.net/coderhouse-ecommerce?retryWrites=true&w=majority';   //No hay variables de entorno todavia por eso me traigo todo lo de DB.

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
app.use(cookieParser())

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

//routes
app.use('/api/products',productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/api/views',viewsRouter)
app.use("/api/sessions",sessionRouter)


//middewlare
//const fileStorage = FileStore(session)
/*
app.use(session({
    secret:'Secreto',
    resave:true,
    saveUninitialized: true
}));*/

/*

app.use(session({
   /* store: new fileStorage({path:'./session', ttl: 100,retries: 0}),*/
   //store: MongoStore.create({
    //mongoUrl: URI, 
    //ttl:15
   //}),
    //secret:"hola",
    //resave: false,
  //  saveUninitialized: false
//}))




//middlware autenticacon
/*
function auth(req,res,next) {
    if(req.session?.user === "pepe" && req.session?.admin) {
        return next()
    }
    res.status(401).send("no estás autorizado.")
}*/

/*
//rutas session

//armando una sesión:
app.get('/session',(req,res)=>{
    if(req.session.counter) {
        req.session.counter++;
        res.send("Se ha visitado el sitio "+req.session.counter)
    } else {
        req.session.counter=1
        res.send("Bienvenido.")
    }
})

//iniciar sesion

app.get('/login', (req, res) => {
    const { username, password } = req.query;

    if (username !== "pepe" || password !== "pepepass") {
        return res.send("login failed");
    }

    // Configurar la sesión antes de enviar la respuesta
    req.session.user = username;
    req.session.admin = true;

    // Envía la respuesta de éxito después de configurar la sesión
    res.send("login success");

    // No deberías enviar ninguna respuesta después de destruir la sesión
    req.session.destroy(err => {
        if (err) {
            console.log("Error al cerrar sesión:", err);
        }
    });
});


//cerrar sesion
app.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err){
            res.send("Saliste de la sesión")
        }else {
            res.send({error: err})
        }
    })
})

//rutas protegidas

app.get('/privado',auth,(req,res)=>{
    res.send("Estas en el mejor lugar.")
})

*/


/*

COOKIES

app.get('/set-signed-cookie', (req,res)=>{
    res
    .cookie("mi cookie","soy el king",{signed: true})
    .send("set cookie")
})

app.get('/get-signed-cookie', (req,res)=>{
    res.send(req.signedCookies)
})
app.get('/getcookie', (req,res)=>{
    res.send(req.cookies)
})
app.get('/deletecookie', (req,res)=>{
    res.clearCookie("micookie").send("Cookie removida")
})
*/


const port = 3000;
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


