import { Router } from 'express'
import userModel from '../dao/models/user.model.js'
import {createHash, isValidPassword} from '../utils.js'

const router = Router();

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
});


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