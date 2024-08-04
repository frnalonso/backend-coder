import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { auth } from '../middlewares/auth.js'

const router = Router();

// Obtener todos los usuarios
router.get("/users",auth, userController.getAll);
  
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
  router.post("/logout", auth, userController.logoutUser);

  
  //Devuelvo el usuario autorizado y formateado por DTO.
  router.get('/current',auth, userController.current);
  
  //Recuperación de la contraseña vía mailing
  router.post('/reset-password', userController.resetPassword);
  //Recuperación de la contraseña vía mailing con token
  router.get('/reset-password/:token', userController.resetPasswordToken);
  //Restaurar password de un usuario
  router.post("/restore", userController.restorePassword);

  
  export default router;