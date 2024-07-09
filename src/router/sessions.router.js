import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import {createHash, isValidPassword} from '../utils.js'
import passport from 'passport';

const router = Router();

/* router.post(register)
router.post("/register", async (req, res) => {

    const {first_name,last_name,email,age,password} = req.body
    //no olvidar validar.

    const exist = await userModel.findOne({email:email})
    if(exist) {
        return res.status(400).send({status:"error", error:"El correo ya existe."})
    }

    const role = email === "adminCoder@coder.com" ? "admin" : "user";

    const user = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role
    };
  const result =  await userModel.create(user)
  console.log(result)
    res.status(201).send({status: "succes", payload: result })
}); */


router.post('/register', passport.authenticate('register', {failureRedirect:'/failregister'}), async(req,res) =>{
    res.status(201).send({status: "succes", message: "Usuario registrado"})
    
})

router.get('/failregister', async(req,res)=>{
    console.log("error")
    res.send({error: "Fallo el router.get /failregister"})
})


/*router.post(login)
router.post("/login", async (req, res) => {

    const {email, password} = req.body 

  try {

     // Verificar si es el usuario administrador hardcodeado
     if (email === "adminCoder@coder.com" && password === "adminCod3er123") {
        const adminUser = {
            email: "adminCoder@coder.com",
            role: "admin",
        };

        res.cookie("user_id", "admin_id", { maxAge: 100000, httpOnly: true });
        req.session.userId = "admin_id";
        req.session.user = adminUser;

        return res.send({
            status: "success",
            payload: req.session.user,
            message: "Inicio exitoso.",
        });
    }
    
    const user = await userModel.findOne({email})

    console.log(user)

    if(!user) {
        return res
        .status(401)
        .send({status: "error",error:"Error en las credenciales."})
    }


    const validPass = isValidPassword(password,user)
    if(!validPass) {
        return res
        .status(401)
        .send({status:"error", error:"Error en las credenciales."})
    }

    //generamos la sesión
    // req.session.user={
    //     name:  `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age,
    // };

    delete user.password 
    req.session.user = user
    res.send({
        status:"succes", 
        payload: req.session.user, 
        message:"Inicio exitoso."
    });

} catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
}
});

*/

router.post('/login', passport.authenticate('login',{failureRedirect: '/faillogin'}),
async(req,res) =>{

if (!req.user) return res.status(400).send('error')

req.session.user = {
    first_name: req.user.first_name,
    last_name: req.user.last_name,
    email: req.user.email,
    age: req.user.age,
    role: req.user.role
};

res.status(200).send({status:"success",payload: req.user})

})

router.get('/faillogin', async(req,res)=>{
    console.log("error")
    res.send({error: "Faillo el router.get /faillogin"})
})


//Iniciar sesión usando GitHub
router.get(
    '/github',
    passport.authenticate('github',{scope: ["user:email"] }),
    async (req, res) =>{
        //podemos enviar una respuesta
        console.log("Exitoso desde get /github")
    }
)

//ruta que nos lleva a github login
router.get(
    '/githubcallback',
    passport.authenticate('github', {failureRedirect: '/login' }),
    async(req, res) => {
        req.session.user = req.user;

        res.redirect('/api/views/products') //ruta a ala que redirigiemos luego del inicio de sesión
    }
)


router.post("/restore", async (req, res) => {
    //validar (si tengo pass vacio o email le mando una rta)
    const {email, password} = req.body
    const user = await userModel.findOne({email})
    console.log(user)

    if (!user){
        res.status(400).send({status: "error", message: "No se encuentra el usuario."})
    }

    const newPass = createHash(password)
    await userModel.updateOne({_id: user._id},{ $set: { password: newPass } })

    res.status(201).send({status: "succes", message:"Password actualizado."})
});

// Manejar el logout
router.post('/logout', async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Error al cerrar sesión:", err);
            res.status(500).send("Error al cerrar sesión");
        } else {
            //res.redirect('/api/views/login'); // Redirigir al usuario al login después de cerrar sesión
            res.status(200).send({status: "succes", message: "Cierre de sesión con éxito."})
        }
    });
});



export default router;