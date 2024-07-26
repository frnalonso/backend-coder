import { Router } from "express";
import { entorno } from '../config/config.js'
import userService from '../dao/services/user.service.js'
import authService from '../config/auth.js'

const router = Router();
const KeyJWT = entorno.secretJWT

class UserController  {

    // Obtener todos los usuarios
     async getAll (req, res) {
        try {
            const users = await userService.getAll();
            res.status(200).json({ users });
        } catch (error) {
            console.error(`Error al cargar los usuarios: ${error}`);
            res.status(500).json({ error: `Error al recibir los usuarios` });
        }
    };

    // Obtener un usuario por su ID
    async getById (req, res)  {
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
    };

    //Crear un nuevo usuario
    async createUser (req, res) {
        try {
            const newUser = req.body;
            const result = await userService.createUser(newUser);
            res.status(201).json({ result });
        } catch (error) {
            console.error(`Error al crear el usuario: ${error}`);
            res.status(500).json({ error: `Error al crear el usuario` });
        }
    };

    //Actualizar un usuario existente
    async updateUser (req, res) {
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
    };

    //Eliminar un usuario por su ID
    async deleteUser (req, res) {
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
    };

    //login
    async loginUser (req, res) {
        try {
          const { email, password } = req.body;
          const user = await authService.login({ email, password });
          console.log(user)
          if (user.token) {
            
            res
              .cookie(KeyJWT, user.token, { httpOnly: true })
              .status(200)
              .send({ status: "success", message: user });
          } else {
            res.status(401).send({ status: "error", message: user.message });
          }
        } catch (error) {
        console.log(error)
          res.status(500).send({ status: "error", message: error.message });
        }
      };

    //Logout del usuario
    async logoutUser(req, res)  {
        //lógica a implementar
    };

    //Restaurar password
    async restorePassword (req, res) {
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
    };

};

export default new UserController;