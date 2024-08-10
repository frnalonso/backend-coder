import { createHash } from "../../utils.js"
import userModel from "../models/user.model.js";
import UserDTO   from "../DTOs/user.dto.js"
import User from "../models/user.model.js";

class UserRepository {

  constructor() {
    console.log("Constructor UserRepository");
  }

  getAll = async () => {
    const result = await userModel.find({}, 'first_name last_name email role').lean();
    return result;
  };

  getById = async (id) => {
    const result = await userModel.findById(id);
    return result;
  };

  createUser = async (userData) => {
    //usar trycatch
    // Hashear la contraseña antes de crear el usuario

    const dtoUser = new UserDTO(userData)
    console.log(dtoUser.password)
    dtoUser.password = createHash(dtoUser.password);
    console.log(dtoUser)
    const result = await userModel.create(dtoUser);
    return result;
  };

  updateUser = async (id, userData) => {
    const result = await userModel.updateOne({ _id: id }, { $set: userData });
   console.log(result)
    return result;
  };

  deleteUser = async (id) => {
    const result = await userModel.deleteOne({ _id: id });
    return result;
  };

  // Buscar con carritos incluidos
  getAllUsersWithCart = async () => {
    //logica a implementar
    try {
      const users = await userModel.find().populate("cart.product");
      return users;
    } catch (error) {
      console.log("error al obtener los usuarios ", error.message);
    }
  };

  // Paginación
  getPaginatedUsers = async (page = 1, limit = 10) => {
    //logica a implementar
    try {
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
      };
      const users = await userModel.paginate({}, options);

      return users;
    } catch (error) {
      console.log("Error al realizar la paginación " + error.message);
    }
  };

  findOne = async(dataUser) => {
    const user = await userModel.findOne(dataUser);
    console.log(user)
    return user;
  }

  current = async(userData) => {
    const user = new UserDTO(userData)
    return user;
  };

  findInactiveUsers = async (dateLimit) => {
    return await userModel.find({ last_connection: { $lt: dateLimit } }).lean();
  };

  updateUserRole = async (uid, newRole) => {
    const result = await userModel.updateOne({ _id: uid }, { $set: { role: newRole } });
    return result;
  }


};

export default new UserRepository;