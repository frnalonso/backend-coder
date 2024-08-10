import { Router } from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT, isAll, isUserOrPremium, isAdmin } from '../middlewares/auth.js'
import { configureDocumentMulter, configureProfileMulter } from "../utils.js"

const router = Router();
const profileUpload = configureProfileMulter();
const documentUpload = configureDocumentMulter();

// Obtener todos los usuarios
router.get("/", authenticateJWT, userController.getAll);

// Obtener un usuario por su ID
router.get("/user/:id", userController.getById);

// Crear un nuevo usuario
router.post("/user", userController.createUser);

// Actualizar un usuario existente
router.put("/user/:id", userController.updateUser);

//Eliminar usuarios con inactividad
router.delete("/", userController.deleteInactiveUsers);

//Eliminar un usuario por su ID
router.delete("/user/:id", userController.deleteUser);

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

//Cambiar el rol del usuario a premium
router.put("/premium/:uid", authenticateJWT, isUserOrPremium, userController.changePremiumRole);

//Cambiar el rol del usuario desde vista Administrador
router.put("/admin/changerol/:uid/role", authenticateJWT, isAdmin, userController.changeRole);

router.post('/:uid/documents',authenticateJWT, isAll, documentUpload.array('documents', 10), userController.uploadDocuments)

router.post('/:uid/profile',authenticateJWT, isAll, profileUpload.array('documents', 10), userController.uploadProfile)

//Vista para el administrador
router.get('/admin/users', authenticateJWT, isAdmin, userController.renderUserManagementPage);



export default router;