import { Router } from "express";
import { entorno } from '../config/config.js'
import userService from '../dao/services/user.service.js'
import authService from '../config/auth.js'
import { generateToken, validateToken } from "../utils.js";

const router = Router();
const KeyJWT = entorno.secretJWT

class UserController {

    // Obtener todos los usuarios
    async getAll(req, res) {
        try {
            const users = await userService.getAll();
            res.status(200).json({ users });
        } catch (error) {
            console.error(`Error al cargar los usuarios: ${error}`);
            res.status(500).json({ error: `Error al recibir los usuarios` });
        }
    };

    // Obtener un usuario por su ID
    async getById(req, res) {
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
    async createUser(req, res) {
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
    async updateUser(req, res) {
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
    async deleteUser(req, res) {
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
    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await authService.login({ email, password });
            if (user.token) {
                // Establece la sesión del usuario
                req.session.token = user.token;
                req.session.userId = user._id;
                req.session.user = user;
                req.session.isAuthenticated = true;
                //req.session.userRole = user.role
                res
                    .cookie(KeyJWT, user.token, { httpOnly: true })
                    .status(200)
                    .send({ status: "success", message: user.message });
            } else {
                res.status(401).send({ status: "error", message: user.message });
            }
        } catch (error) {
            console.log(error)
            res.status(500).send({ status: "error", message: error.message });
        }
    };

    // Manejar el logout
    async logoutUser(req, res) {

        try {
            req.session.destroy(err => {
                if (err) {
                    console.error("Error al cerrar sesión:", err);
                    res.status(500).send("Error al cerrar sesión");
                } else {
                    //res.redirect('/api/views/login'); // Redirigir al usuario al login después de cerrar sesión
                    res.status(200).send({ status: "succes", message: "Cierre de sesión con éxito." })
                }
            });
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message });
        }

    };


    
        async current(req, res) {
            try {
                const user = req.session.user.user
                const dataUser = await userService.current(user);
                res.send({ status: "succes", payload: req.user, dataUser })
            } catch (error) {
                res.status(401).send({ status: "error", message: error });
            }
        };

    //Realizo el update del password una vez ya obtenido el token.
    async restorePassword(req, res) {
        try {
        const { password } = req.body;
        const {token} = req.query;
        // Decodificar el token para obtener el ID del usuario
        const decodedToken = validateToken(token);
        const result = await userService.updatePassword({_id: decodedToken.userId}, password);
        res.status(201).send({ status: "succes", message: "Password actualizado." , result})
        } catch (error) {
            console.log(error)
            res.status(401).send({ status: "error", message: error.message });
        }
    };

    //Realizo la generación de token y envío email para restablecer clave
    async resetPassword(req, res) {
        try {
            const { email } = req.body
            const user = await userService.findOne({ email })
            const token = generateToken(user._id)
            const sendEmail = await userService.sendPasswordResetEmail(email, token);
            res.status(200).send({ status: "success", message: "Correo enviado.", sendEmail })
        } catch (error) {
            console.log(error)
            res.status(400).send({ status: "error", message: error })
        }

    };

    //Valido token y redirigo a la vista para restaurar password
    async resetPasswordToken(req, res) {
        try {
            const token = req.params.token
            const decodedToken = validateToken(token)
            if (!decodedToken) return res.redirect("/api/views/forgotpassowrd");
            res.redirect(`/api/views/restore?token=${token}`);
        } catch (error) {
            res.status(400).send({ status: "error", message: error })
        }
    };

};

export default new UserController;