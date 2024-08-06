import { createHash } from "../../utils.js"
import userRepository from "../repositories/user.repository.js"
import cartRepository from "../repositories/cart.repository.js";
import authService from '../../config/auth.js'
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'


class UserService {

  constructor() {
    console.log("Constructor UserManager");
  }

  loginUser = async (email, password) => {
    const user = await authService.login({ email, password });
    return user;
  }

  getAll = async () => {
    const result = await userRepository.getAll();
    return result;
  };

  getById = async (id) => {
    const result = await userRepository.getById(id);
    return result;
  };

  createUser = async (userData) => {
    // Hashear la contraseña antes de crear el usuario
    //userData.password = createHash(userData.password);
    const result = await userRepository.createUser(userData);
    return result;
  };

  updateUser = async (id, userData) => {
    // Hashear la contraseña antes de actualizar el usuario
    //if (userData.password) {
    //userData.password = createHash(userData.password);
    //}
    console.log(userData)
    const result = await userRepository.updateUser(id, userData, { new: true });
    return result;
  };

  deleteUser = async (id) => {
    const result = await userRepository.deleteUser(id);
    return result;
  };

  // Buscar con carritos incluidos
  getAllUsersWithCart = async () => {
    //logica a implementar
    try {
      const users = await userRepository.getAllUsersWithCart();
      return users;
    } catch (error) {
      console.log("error al obtener los usuarios ", error.message);
    }
  };

  // Paginación
  getPaginatedUsers = async (page = 1, limit = 10) => {
    //logica a implementar
    try {
      const users = await userRepository.getPaginatedUsers(page = 1, limit = 10)
      return users;
    } catch (error) {
      console.log("Error al realizar la paginación " + error.message);
    }
  };

  findOne = async (dataUser) => {
    const user = await userRepository.findOne(dataUser)
    return user;
  };

  current = async (dataUser) => {
    console.log("user.repository: " + dataUser)
    const user = await userRepository.current(dataUser);
    return user;
  };

  sendPasswordResetEmail = async (email, token) => {
    const url = `http://localhost:8000/api/users/reset-password/${token}`;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const result = transporter.sendMail({
      from: '"Tu Nombre" <tu_email@gmail.com>',
      to: email,
      subject: "Restablecer contraseña",
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${url}">Restablecer contraseña</a><p>Este enlace expira en 5 minutos.</p>`,
    });

    return result;
  }

  updatePassword = async (userId, newPassword) => {
    const user = await userRepository.findOne(userId)
    console.log("encontre?")
    if (!user) {
      throw new Error('Usuario no encontrado.')
    }
    console.log("user.service: " + user.password)
    const isSamePassword = await bcrypt.compare(newPassword, user.password)
    if (isSamePassword) {
      throw new Error('No puede usar la misma contraseña anterior.')
    }
    //Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    const result = await userRepository.updateUser(userId, { password: hashedPassword });
    return result;

  }

  changePremiumRole = async (userId) => {
    const user = await userRepository.findOne({_id: userId})
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    // Alternar entre roles "user" y "premium"
    const newRole = user.role === 'user' ? 'premium' : 'user';
    user.role = newRole;

    const updatedUser = await userRepository.updateUser(userId, {role: newRole})

    if (!updatedUser) {
      throw new Error("Error al actualizar el rol del usuario");
  }

  return updatedUser;

  };


};

export default new UserService;