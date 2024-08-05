import cartModel from "../models/cart.model.js";
import  cartDTO  from "../DTOs/cart.dto.js"

class CartRepository {
    constructor() {
        console.log("Repositorio de Carritos")
    }

    async findAll() {
        const response = await cartModel.find();
        return response;
    }

    async findById(id) {

        try {
            const response = await cartModel.findById(id);
           
            return response;
        } catch (error) {
            console.log(error)
        }

    };

    async findByIdWithProducts(id) {
        try {
            const response = await cartModel.findById(id).populate({path:'products.product',model:'Product'}).lean();
            return response;
        } catch (error) {
            console.log(error)
        }

    }



    async createOne() {

        const response = await cartModel.create({});
        return response;
    };

    async deleteOne() {
        const response = await cartModel.findByIdAndDelete({ id });
        return response;
    };

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
    
    };

    async updateCartArrayProducts(idCart, ArrayProducts) {
        try {
            console.log("ArrayProducts recibido:", ArrayProducts);
    
            // Verifica que ArrayProducts.products sea un array
            if (!Array.isArray(ArrayProducts.products)) {
                throw new TypeError("El argumento ArrayProducts.products no es un array.");
            }
    
            const cart = await cartModel.findById(idCart).populate({
                path: 'products.product',
                model: 'Product'
            });
    
            if (!cart) {
                throw new Error("Carrito no encontrado.");
            }
    
            const productsToRemove = ArrayProducts.products;
    
            // Filtra los productos del carrito que no están en la lista de productos a remover
            cart.products = cart.products.filter(cartProduct => 
                !productsToRemove.some(removedProduct => 
                    removedProduct.product.toString() === cartProduct.product._id.toString()
                )
            );
    
            await cart.save();
    
            return "Carrito actualizado y productos comprados eliminados.";
        } catch (error) {
            console.log("Error al actualizar el carrito: ", error);
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
    };
    
    async insertProductInCart(cid, idProduct, userId) {

        try {

                    const  cart = await cartModel.findById(cid)

            if (cart) {
                const product = cart.products.find((product) => product.product.toString() == idProduct.toString())
                if (product) {
                    product.quantity += 1
                } else {
                    cart.products.push({ product: idProduct, quantity: 1 })
                }

            } else {
                //Carrito no existe para el usuario, se crea el carrito.
                const newCart = new cartModel.createOne({
                    products: [{
                        product: idProduct,
                        quantity: 1,
                    }],
                    user: userId
                })
                return await newCart.save()
            }

            return await cart.save();

        } catch (error) {
            console.log(error)
            throw error;
        }
    };

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
    };




};

export default new CartRepository;