import { createHash } from "../../utils.js"
import userRepository from "../repositories/user.repository.js"
import cartRepository from "../repositories/cart.repository.js";
import authService from '../../config/auth.js'

class UserService {

  constructor() {
    console.log("Constructor UserManager");
  }

  loginUser = async(email,password) => {
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
    const result = await userRepository.updateUser(id, userData, {new: true});
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

  findOne = async(dataUser) => {
    const user = await userRepository.findOne(dataUser)
    return user;
  };

};

export default new UserService;