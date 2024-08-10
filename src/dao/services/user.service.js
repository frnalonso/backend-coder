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
    const users = await userRepository.getAll();
    return users.map(user => ({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role
    }));
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
      from: '"Ecommerce Francisco" <ecommercefrn@gmail.com>',
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
    const user = await userRepository.findOne({ _id: userId })
    if (!user) {
      throw new Error("Usuario no encontrado")
    }

    // Verificar si el usuario ha subido los documentos requeridos
    const requiredDocuments = ['Identificacion', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];


    const userHasAllDocuments = requiredDocuments.every(docName =>
      user.documents.some(doc => {
        const docNameWithoutExtension = doc.name.split('.').slice(0, -1).join('.');
        return docNameWithoutExtension === docName;
      })
    );

    if (!userHasAllDocuments && user.role === 'user') {
      throw new Error("Faltan documentos requeridos para cambiar el rol a premium. El usuario no ha terminado de procesar su documentación.");
    }

    // Alternar entre roles "user" y "premium"
    const newRole = user.role === 'user' ? 'premium' : 'user';
    user.role = newRole;

    const updatedUser = await userRepository.updateUser(userId, { role: newRole })

    if (!updatedUser) {
      throw new Error("Error al actualizar el rol del usuario");
    }

    return updatedUser;

  };

  updateLastConnection = async (userId) => {
    const lastConnectionDate = new Date();
    await userRepository.updateUser(userId, { last_connection: lastConnectionDate });
  };

  uploadUserDocuments = async (userId, files) => {
    try {
      // Encuentra el usuario por ID
      const user = await userRepository.findOne({ _id: userId })

      if (!user) {
        throw new Error('User not found');
      }

      // Crear el array de documentos con las propiedades name y reference
      const newDocuments = files.map(file => ({
        name: file.originalname,
        reference: file.path // Ruta o referencia del archivo
      }));

      // Agregar los nuevos documentos al array existente
      user.documents = [...user.documents, ...newDocuments];
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error al subir documento/s: ${error.message}`);
    }
  };

  uploadUserProfile = async (userId, files) => {
    try {
      // Encuentra el usuario por ID
      const user = await userRepository.findOne({ _id: userId })

      if (!user) {
        throw new Error('User not found');
      }

      // Crear el array de documentos con las propiedades name y reference
      const newDocuments = files.map(file => ({
        name: file.originalname,
        reference: file.path // Ruta o referencia del archivo
      }));

      // Agregar los nuevos documentos al array existente
      user.documents = [...user.documents, ...newDocuments];
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error al subir foto de perfil: ${error.message}`);
    }
  };

  sendDeletionEmail = async (email) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const result = transporter.sendMail({
      from: '"Ecommerce Francisco" <ecommercefrn@gmail.com>',
      to: email,
      subject: "Usuario eliminado",
      html: `<p>Tu usuario ha sido eliminado por inactividad.</p>`,
    });

    return result;
  };

  deleteInactiveUsers = async () => {
    const dateLimit = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días
    const inactiveUsers = await userRepository.findInactiveUsers(dateLimit);

    for (const user of inactiveUsers) {
      await userRepository.deleteUser(user._id);
      await this.sendDeletionEmail(user.email);
    }

    return `${inactiveUsers.length} usuarios eliminados por inactividad.`;
  };

  updateUserRole = async (uid, newRole) => {
    const user = userRepository.findOne({ _id: uid })
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    const userUpdateRole = await userRepository.updateUserRole(uid, newRole)
    console.log(userUpdateRole)
    return userUpdateRole;

  }

};

export default new UserService;