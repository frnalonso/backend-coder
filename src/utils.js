import { dirname } from 'path'
import { fileURLToPath } from 'url'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"



//Clave secreta para firmar el token JWT

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
//clave secreta para firmar el token JWT
const JWT_SECRET = "KeyFrancisco"

//usar trycatch
//hasheo de password
export const createHash = (password) =>
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  
  //validar password
  export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };
  
  // Generar un token JWT
  export const generateToken = (email) => {
    return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
  };
 

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

