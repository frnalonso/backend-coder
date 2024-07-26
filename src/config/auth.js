//authManager va a trabajar toda la lógica de la sesión
import userModel from "../dao/models/user.model.js";
import { isValidPassword, generateToken } from "../utils.js";
 class AuthManager {
  constructor() {
    console.log("Constructor AuthManager");
  }

  async login({ email, password }) {
    try {
      //lógica a implementar
      const user = await userModel.findOne({ email });
      console.log("auth.js: "+user,password)
      if (!user) return "Usuario no encontrado";
      const valid = isValidPassword(user, password);
      console.log(valid)
      if (!valid) return "Error de auteuticación";
      const token = generateToken(email);
      return { message: "Autenticacion exitosa", token, userId: user._id};
    } catch (error) {
      res.status(500).send({ status: "error", massage: error.message });
    }
  }
};

export default new AuthManager;