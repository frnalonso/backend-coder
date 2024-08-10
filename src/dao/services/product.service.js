import productRepository from '../repositories/product.repository.js'
import userRepository from '../repositories/user.repository.js';
import nodemailer from 'nodemailer';

class ProductService {

    constructor() {
        console.log("Servicio de Producto")
    }
    //Obtengo productos
    async findAll(params) {
        const response = await productRepository.findAll(params)
        return response;
    }

    async findById(id) {
        const response = await productRepository.findById(id);
        return response;
    }
    async createOne(productData, userRole, userId) {

        // Verifica si el código del producto ya existe
        const existingProduct = await productRepository.findOne({ code: productData.code });
        if (existingProduct) {
            throw new Error('El código del producto ya está en uso.');
        }

        // Si el usuario es premium, asignar su ID como owner, de lo contrario asignar "admin" (entiendo que premium y admin pueden crear asi que se asigna el id.)
        if (userRole === 'premium') {
            productData.owner = userId;
        } else {
            productData.owner = userId
        }

        // Llamar al repositorio para crear el producto
        return await productRepository.createOne(productData);
    };


    async updateOne(id, obj) {
        const existingProduct = await productRepository.findById(id);
        if (!existingProduct) {
            throw new Error('Producto no encontrado');
        }
        return await productRepository.updateOne(id, obj);
    }

    async deleteOne(id, userRole, userId) {
        const product = await productRepository.findById(id);
        const owner = await userRepository.findOne({_id: product.owner})

        if (!product) {
            throw new Error('Producto no encontrado');
        }
        //Verifica permisos de eliminación
        if (userRole === 'admin' && owner.role == 'premium') {
            console.log("entra la primer if")
            // Los administradores pueden eliminar cualquier producto
            const sendEmail = await this.sendProductDeletionEmail(owner.email)
            return await productRepository.deleteOne(id);
        } else if (userRole === 'premium') {
            // Los usuarios premium solo pueden eliminar productos que les pertenecen
            if (product.owner.toString() === userId.toString()) {
                return await productRepository.deleteOne(id);
            } else {
                throw new Error('No tienes permiso para eliminar este producto.');
            }
        } else {
            throw new Error('Acceso denegado: No tienes permisos para eliminar productos.');
        }
       

    };

    sendProductDeletionEmail = async (userEmail) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          },
        });
    
        const result = transporter.sendMail({
          from: '"Ecommerce Francisco" <alofrandi@gmail.com>',
          to: userEmail,
          subject: "Producto Eliminado",
          html: `<p>Tu producto ha sido eliminado del catálogo. Si tienes alguna pregunta, por favor contáctanos.</p>`,
        });

        console.log("Email")
        console.log(result)
        console.log("Email")
        return result;
      }

    uploadUserProduct = async (userId, files) => {
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
            throw new Error(`Error al subir foto del producto: ${error.message}`);
        }
    };



    //buscar con categorias incluidas
    getAllProductsWithCategories = async () => {
        //lógica a implementar
        const products = await productRepository.getAllProductsWithCategories()
        return products;
    };

};

export default new ProductService;