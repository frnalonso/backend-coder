import  cartModel  from '../models/cart.model.js'
import productModel from '../models/product.model.js';


class CartService {

    constructor() {
        console.log("Servicio de Carrito")
    }
    async findAll() {
        const response = await cartModel.find();
        return response;
    }

    async findById(id) {

        try {
            const response = await cartModel.findById(id).populate({path:'products.product',model:'Product'}).lean()
           
            return response;
        } catch (error) {
            console.log(error)
        }

    }
    async createOne() {

        const response = await cartModel.create({});
        return response;
    }

    async deleteOne() {
        const response = await cartModel.findByIdAndDelete({ id });
        return response;
    }

    async removeProductCart (cid, pid) {
        // Buscar el carrito por su ID
        const cart = await cartModel.findById(cid);
    
        try {
            
            if (!cart) {
            return console.log("Carrito no encontrado. Por favor revise que exista el carrito.")
          }
    
          const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
          console.log(productIndex)
          if (productIndex === -1) {
            return console.log("Producto no encontrado. Por favor revise que exista el producto.")
          }
 
          // Eliminar el producto del array
          cart.products.splice(productIndex, 1);
    
            return await cart.save();

        } catch (error) {
            return console.log(error)
        }
    
    }

    async updateCartArrayProducts (idCart, ArrayProducts) {
        try {

            const cart = await cartModel.findById(idCart).populate({
                path: 'products.product',
                model: 'Product'
            });

            if (!cart) {
                throw new Error("Carrito no encontrado.")
            }

            const addProducts = ArrayProducts



               for (const newProduct of addProducts) {
                   const productIndex = cart.products.findIndex((product) => product.product._id.toString() === newProduct.product)
                   console.log(productIndex)
                   if (productIndex !== -1) {
                    console.log(cart.products[productIndex].quantity)
                    console.log(newProduct.quantity)
                      cart.products[productIndex].quantity += newProduct.quantity
                    } else {
                        console.log("id:"+newProduct.product)
                        const product = await productModel.findById(newProduct.product);
                       cart.products.push({
                           product: product,
                           quantity: newProduct.quantity,
                       })
                   }
               }
                
                await cart.save();
                
                return "Carrito actualizado."
            } catch (error) {
                console.log("Error al actualizar el carrito: ",error)
                throw error;
            }
    }

    async updateQuantityProductInCart(idCart, idProduct, quantity) {
        try {

            const cart = await cartModel.findById(idCart)
    
            if (!cart) {
                throw new Error("Carrito no encontrado.")
            }

            const productIndex = cart.products.findIndex(item => item.product.toString() === idProduct);
            console.log(productIndex)
            if (productIndex !== -1) {
                console.log(cart.products[productIndex].quantity)
                console.log(Number(quantity))
                
                  cart.products[productIndex].quantity += Number(quantity)
             } else {
                    console.log("No existe el producto.")
                }

                await cart.save();
            return "Cantidad sumada correctamente."

        } catch (error) {
            console.log("Error al actualizar la cantidad ",error)
            throw error;
        }
    }
    
    async insertProductInCart(idCart, idProduct) {

        try {

            const cart = await cartModel.findById(idCart)
            if(!cart){
                return "Carrito no encontrado. Por favor revise que exista el carrito."
            }

            const product =  cart.products.find((product)=> product.product.toString() == idProduct.toString())
            
            if (product) {
                product.quantity += 1
            } else {
                cart.products.push({product: idProduct, quantity: 1})
            }

            return await cart.save();

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    async deleteAllProductsInCart(cid) {
        try {
            const cart = await cartModel.findById(cid);
            if (!cart) {
              throw new Error("El carrito no existe.");
            }
            cart.products = [];
            return await cart.save();
        } catch (error) {
            throw error;
        }
    }

}

export default new CartService();