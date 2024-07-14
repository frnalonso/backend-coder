import mongoose from 'mongoose';
import { entorno } from '../config/config.js'

const URI = entorno.mongoUrl

//const URI = 'mongodb+srv://falonso:123@coderhouse-ecommerce.u3qivcn.mongodb.net/coderhouse-ecommerce?retryWrites=true&w=majority';

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


  export default dbConnection;