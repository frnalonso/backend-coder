//Separa la logica de sesion para que se haga responsable este middleware de aplicar la estrategia local.

import passport from 'passport';
import jwt from 'passport-jwt';
import { entorno } from './config.js' 

//import local from 'passport-local'
import userModel from '../dao/models/user.model.js'
//import { createHash, isValidPassword } from '../utils.js'; //se quitara del otro archivo.
//import bcrypt from "bcrypt";

import GitHubStrategy from 'passport-github2'

//const LocalStrategy = local.Strategy
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;
const KeyJWT = entorno.secretJWT

const initilizePassport = () => {

        //funcion que extrae las cookies
        const cookieExtractor = (req) => {
            //lógica
            let token = null
            if (req && req.cookies) {
                token = req.cookies[KeyJWT]
            }
            return token;
        };
    

    //Estrategia 2: jwt
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: KeyJWT,
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload)
            } catch (error) {
                return done(error)
            }
        }
    ));





    /* #####Estrategia 1: no utiliza JWT########
    //estrategia REGISTER
    passport.use(
        'register', new LocalStrategy({passReqToCallback:true, usernameField:"email"},
        async(req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body
            try {
                const user = await userModel.findOne({email: username})
                if(user){
                    console.log("El usuario existe")
                    return done(null, false, {message: "El usuario ya existe"})
                }
    
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    //role
                };
    
                const result = await userModel.create(newUser)
                return done(null, result) 
    
            } catch (error) {
                return done(error)
            }
        })
    
    );
    
    //estrategia LOGIN
    passport.use(
        'login', 
        new LocalStrategy({usernameField:"email"},
        async (username, password, done) => {
           
            try {
                const user = await userModel.findOne({email: username})
    
                if(!user) {  
                    return done(null, false, {message: "Credenciales incorrectas"})
                }
    
                 const validPassword = await bcrypt.compare(password, user.password)
    
                if(!validPassword) { 
                    return done(null, false, {message: "Credenciales incorrectas"})   
                }
    
                return done(null, user);
    
    
            } catch (error) {
                return done(error)
            }
        })
    
    );
    
    
    
    // Serializar y deserializar usuario para guardar en sesión
    passport.serializeUser((user, done) => {
       done(null, user._id);
    });
    
    passport.deserializeUser(async (id, done) => {
       try {
           const user = await userModel.findById(id);
           done(null, user);
       } catch (error) {
           done(error);
       }
    });
    
    
    */

    //github
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: "Iv23liF6HQ7dnkOGxYBN", //id de la app en github
                clientSecret: "9822d8460379e0c0344733e4f3df7fabed043764",  //clave secreta de github
                callbackURL: "http://localhost:8000/api/sessions/githubcallback" //url callback
            },
            async (accesToken, refreshToken, profile, done) => {
                try {
                    console.log(profile)
                    const user = await userModel.findOne({
                        email: profile._json.email,
                    });
                    //si no existe lo creamos
                    if (!user) {
                        //construimos el objeto segun el modelo ()
                        const newUser = {
                            first_name: profile._json.name,
                            last_name: "",
                            age: "",
                            email: profile._json.email,
                            password: ""
                        };
                        //guardamos el usuario en la database
                        let createdUser = await userModel.create(newUser)
                        done(null, createdUser);
                    } else {
                        done(null, user)
                    }
                } catch (error) {
                    return done(error)
                }
            }
        )

    );


};





export default initilizePassport;

