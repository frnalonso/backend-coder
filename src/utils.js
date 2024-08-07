import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { entorno } from '../src/config/config.js'
import multer from 'multer';
import path from 'path'



//Clave secreta para firmar el token JWT

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)



//usar trycatch
//hasheo de password
export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  
  //validar password
  export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };
  
  // Generar un token JWT
  export const generateToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, entorno.secretJWT, { expiresIn: "1h" });
  };

  export const validateToken = (token) => {
    try {
      const decoded = jwt.verify(token, entorno.secretJWT);
      return decoded;
    } catch (error) {
      console.log(error)
      return null;
    }
  };
 
  export function configureProductMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'products'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });    

    return multer({ storage: storage });
}

export function configureProfileMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'profiles'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });    

    return multer({ storage: storage });
}

export function configureDocumentMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'public', 'documents'));
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname);
        },
    });    

    return multer({ storage: storage });
}

/*
export const authToken = ( req, res, next ) => {
//lógica de autorización
const authHeader = req.headers.authorization;

if (!authHeader) 
    return res.status(401).send({status: "error", message:"No autorizado"});
console.log(authHeader)

const token = authHeader.split(' ')[1]

jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
    console.log(error)
    if(error)
        return res.status(401).send({status: "error", message: "No autorizado"})
    req.user = credentials.user
    next()
})



}

*/

export default __dirname;

