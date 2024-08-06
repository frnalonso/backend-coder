import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT, isUser, isUserOrPremium } from '../middlewares/auth.js'

const router = Router();

// Obtener todos los usuarios
router.get("/users", authenticateJWT, userController.getAll);

// Obtener un usuario por su ID
router.get("/user/:id", userController.getById);

// Crear un nuevo usuario
router.post("/user", userController.createUser);

// Actualizar un usuario existente
router.put("/user/:id", userController.updateUser);

//Eliminar un usuario por su ID
router.delete("/user/:id", userController.updateUser);

//login
router.post("/login", userController.loginUser);

//Logout del usuario
router.post("/logout", authenticateJWT, userController.logoutUser);


//Devuelvo el usuario autorizado y formateado por DTO.
router.get('/current', authenticateJWT, userController.current);

//Recuperación de la contraseña vía mailing
router.post('/reset-password', userController.resetPassword);
//Recuperación de la contraseña vía mailing con token
router.get('/reset-password/:token', userController.resetPasswordToken);
//Restaurar password de un usuario
router.post("/restore", userController.restorePassword);

//Maneja la solicitud para cambiar el rol del usuario a premium
router.put("/premium/:uid", authenticateJWT, isUserOrPremium, userController.changePremiumRole);


export default router;