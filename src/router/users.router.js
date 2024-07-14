import { Router } from "express";
import userController from "../controllers/user.controller.js";
import passport from "passport";

const router = Router();

// Obtener todos los usuarios
router.get("/users",passport.authenticate('jwt', {session:false}), userController.getAll);
  
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
  router.post("/logout", userController.logoutUser);

  //Restaurar password de un usuario
  router.post("/restore", userController.restorePassword);
  
  export default router;