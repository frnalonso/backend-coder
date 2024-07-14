import { Router } from "express";
import { entorno } from '../config/config.js'
import UserService from "../dao/services/user.service.js"
import AuthService from "../dao/services/auth.service.js";
import passport from "passport";

const router = Router();
const userService = new UserService()
const authService = new AuthService()
const KeyJWT = entorno.secretJWT

const userController = {

    // Obtener todos los usuarios
    getAll: async (req, res) => {
        try {
            const users = await userService.getAll();
            res.status(200).json({ users });
        } catch (error) {
            console.error(`Error al cargar los usuarios: ${error}`);
            res.status(500).json({ error: `Error al recibir los usuarios` });
        }
    },

    // Obtener un usuario por su ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.getById(id);
            if (user) {
                res.status(200).json({ user });
            } else {
                res.status(404).json({ error: `Usuario con id: ${id} no encontrado` });
            }
        } catch (error) {
            console.error(`Error al cargar el usuario: ${error}`);
            res.status(500).json({ error: `Error al recibir el usuario` });
        }
    },

    //Crear un nuevo usuario
    createUser: async (req, res) => {
        try {
            const newUser = req.body;
            const result = await userService.createUser(newUser);
            res.status(201).json({ result });
        } catch (error) {
            console.error(`Error al crear el usuario: ${error}`);
            res.status(500).json({ error: `Error al crear el usuario` });
        }
    },

    //Actualizar un usuario existente
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedUser = req.body;
            const result = await userService.updateUser(id, updatedUser);
            if (result) {
                res.status(200).json({ message: "Usuario actualizado exitosamente" });
            } else {
                res.status(404).json({ error: "Usuario no encontrado" });
            }
        } catch (error) {
            console.error(`Error al actualizar el usuario: ${error}`);
            res.status(500).json({ error: `Error al actualizar el usuario` });
        }
    },

    //Eliminar un usuario por su ID
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedUser = await userService.deleteUser(id);
            if (deletedUser) {
                res.status(200).json({ message: "Usuario eliminado exitosamente" });
            } else {
                res.status(404).json({ error: "Usuario no encontrado" });
            }
        } catch (error) {
            console.error(`Error al eliminar el usuario: ${error}`);
            res.status(500).json({ error: `Error al eliminar el usuario` });
        }
    },

    //login
    loginUser: async (req, res) => {
        //lógica a implementar
        try {
            const { email, password } = req.body;
            const user = await authService.login({ email, password });
            console.log(user)
            console.log("token: " + user.token);
            if (user.token) {
                res
                    .cookie(KeyJWT, user.token, {
                        httpOnly: true,
                    })
                    .status(200)
                    .send({ status: "success", message: user.message });
            }
        } catch (error) {
            res.send({ status: "error", message: error });
        }
    },

    //Logout del usuario
    logoutUser: async (req, res) => {
        //lógica a implementar
    },

    //Restaurar password
    restorePassword: async (req, res) => {
        //validar (si tengo pass vacio o email le mando una rta)
        const {email, password} = req.body
        const user = await userService.findOne({email})//revisar metodo findOne
        console.log(user)
    
        if (!user){
            res.status(400).send({status: "error", message: "No se encuentra el usuario."})
        }
    
        const newPass = createHash(password)
        await userService.updateOne({_id: user._id},{ $set: { password: newPass } }) //revisar metodo updateOne
    
        res.status(201).send({status: "succes", message:"Password actualizado."})
    },

};

export default userController;